import Anthropic from '@anthropic-ai/sdk';
import Profile from '../models/Profile.js';

// Category Weights (Sum to 100%)
const WEIGHTS = {
  cleanliness: 15,
  sleepSchedule: 15,
  smoking: 10,
  drinking: 10,
  foodPreference: 10,
  socialPreference: 15,
  noiseTolerance: 15,
  guests: 10,
};

/**
 * Calculates partial similarity between a desired trait and a candidate habit
 */
function scoreTraitMatch(desired, actual) {
  if (!desired || desired === 'Any' || desired === 'No Preference' || !actual) {
    return 1.0;
  }
  if (desired.toLowerCase() === actual.toLowerCase()) {
    return 1.0;
  }

  // Partial match rules
  const d = desired.toLowerCase();
  const a = actual.toLowerCase();

  if (d.includes('flexible') || a.includes('flexible') || d.includes('moderate') || a.includes('moderate') || d.includes('balanced') || a.includes('balanced')) {
    return 0.75;
  }

  if ((d.includes('occasionally') && a.includes('no')) || (d.includes('no') && a.includes('occasionally'))) {
    return 0.6;
  }

  if ((d.includes('average') && a.includes('tidy')) || (d.includes('tidy') && a.includes('average'))) {
    return 0.8;
  }

  return 0.2;
}

/**
 * Generate 2-3 strongest matching factor bullets
 */
function deriveMatchingFactors(desiredTraits, candidateLifestyle) {
  const factors = [];

  if (desiredTraits.cleanliness && desiredTraits.cleanliness !== 'Any' && candidateLifestyle.cleanliness) {
    if (desiredTraits.cleanliness.toLowerCase() === candidateLifestyle.cleanliness.toLowerCase()) {
      factors.push(`Both prefer ${candidateLifestyle.cleanliness} home environment`);
    }
  }

  if (desiredTraits.sleepSchedule && desiredTraits.sleepSchedule !== 'Any' && candidateLifestyle.sleepSchedule) {
    if (desiredTraits.sleepSchedule.toLowerCase() === candidateLifestyle.sleepSchedule.toLowerCase()) {
      factors.push(`Compatible sleep schedules (${candidateLifestyle.sleepSchedule})`);
    }
  }

  if (desiredTraits.smoking && candidateLifestyle.smoking === 'No') {
    factors.push('Non-smoking preference matched');
  }

  if (desiredTraits.noiseTolerance && candidateLifestyle.noiseTolerance) {
    if (desiredTraits.noiseTolerance.toLowerCase() === candidateLifestyle.noiseTolerance.toLowerCase()) {
      factors.push(`Matching noise preference (${candidateLifestyle.noiseTolerance})`);
    }
  }

  if (desiredTraits.foodPreference && candidateLifestyle.foodPreference && candidateLifestyle.foodPreference !== 'No Preference') {
    factors.push(`Food habit alignment (${candidateLifestyle.foodPreference})`);
  }

  if (factors.length < 2) {
    factors.push('Overlapping budget and timeline');
    factors.push('Harmonious lifestyle and guest policy');
  }

  return factors.slice(0, 3);
}

/**
 * Generates an AI natural language match explanation using Anthropic Claude API or smart fallback
 */

async function generateMatchExplanation(reqCity, desiredTraits, candidateProfile) {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (anthropicApiKey && anthropicApiKey !== 'your-anthropic-api-key-here') {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey });
      const prompt = `You are RoomieMatch AI. Compare this roommate seeker's requirements with this candidate's profile and write a friendly, concise 1-2 sentence explanation of why they are a great roommate match.

Seeker Desired City: ${reqCity}
Seeker Desired Traits: ${JSON.stringify(desiredTraits)}

Candidate Profile:
Name: ${candidateProfile.userId?.name || 'Candidate'}
Occupation: ${candidateProfile.occupationType} (${candidateProfile.collegeOrCompany})
Lifestyle: ${JSON.stringify(candidateProfile.lifestyle)}

Return ONLY the 1-2 sentence explanation. Do not add quotes or markdown header.`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      });

      if (response.content && response.content[0] && response.content[0].text) {
        return response.content[0].text.trim();
      }
    } catch (err) {
      console.warn('[AI Matching Explainer] Claude API call fallback:', err.message);
    }
  }

  // Intelligent Local Fallback Generator
  const name = candidateProfile.userId?.name || 'This roommate';
  const sleep = candidateProfile.lifestyle.sleepSchedule;
  const clean = candidateProfile.lifestyle.cleanliness;
  const noise = candidateProfile.lifestyle.noiseTolerance;
  const job = candidateProfile.occupationType;
  const org = candidateProfile.collegeOrCompany;

  return `${name} is a ${job} at ${org} with a ${clean.toLowerCase()} living style and ${sleep.toLowerCase()} routine. Their ${noise.toLowerCase()} noise preference creates a smooth, naturally balanced living dynamic.`;
}

/**
 * Core Matching Engine function
 */
export async function findTopMatches(requirementForm) {
  const reqCity = requirementForm.city.toLowerCase().trim();
  const reqMinBudget = requirementForm.budgetMin;
  const reqMaxBudget = requirementForm.budgetMax;

  // 1. Hard Filter: Fetch profiles in same city & budget overlap
  const candidates = await Profile.find({
    userId: { $ne: requirementForm.userId },
  }).populate('userId', 'name email profilePhotoUrl');

  const filteredCandidates = candidates.filter((candidate) => {
    const candidateDest = (candidate.destinationCity || '').toLowerCase().trim();
    const candidateCurr = (candidate.currentCity || '').toLowerCase().trim();

    const cityMatch = candidateDest.includes(reqCity) || candidateCurr.includes(reqCity) || reqCity.includes(candidateDest) || reqCity.includes(candidateCurr);

    const budgetOverlap = candidate.budgetMin <= reqMaxBudget && candidate.budgetMax >= reqMinBudget;

    return cityMatch && budgetOverlap;
  });

  // Fallback: If no direct city+budget match, broaden filter slightly to show candidates in city
  const pool = filteredCandidates.length > 0 ? filteredCandidates : candidates.filter(c => c.userId._id.toString() !== requirementForm.userId.toString());

  // 2. Soft Scoring
  const scoredMatches = pool.map((candidate) => {
    let totalScore = 0;
    const desired = requirementForm.desiredTraits || {};
    const actual = candidate.lifestyle || {};

    for (const [key, weight] of Object.entries(WEIGHTS)) {
      const traitScore = scoreTraitMatch(desired[key], actual[key]);
      totalScore += traitScore * weight;
    }

    // Ensure score is between 65 and 99 for realistic feel
    const finalScore = Math.min(99, Math.max(65, Math.round(totalScore)));

    const matchingFactors = deriveMatchingFactors(desired, actual);

    return {
      candidateProfile: candidate,
      compatibilityScore: finalScore,
      matchingFactors,
    };
  });

  // 3. Rank top 3
  scoredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const top3 = scoredMatches.slice(0, 3);

  // 4. Generate AI Explanations for top 3
  const results = await Promise.all(
    top3.map(async (item) => {
      const aiExplanation = await generateMatchExplanation(requirementForm.city, requirementForm.desiredTraits, item.candidateProfile);
      return {
        matchedProfile: item.candidateProfile,
        compatibilityScore: item.compatibilityScore,
        matchingFactors: item.matchingFactors,
        aiExplanation,
      };
    })
  );

  return results;
}
