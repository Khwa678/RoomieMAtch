import Message from '../models/Message.js';
import Match from '../models/Match.js';

// @desc    Get all connected chat conversations for logged-in user
// @route   GET /api/chat/conversations
export const getConversations = async (req, res) => {
  try {
    // Find all connected matches involving logged-in user (as seeker or matched profile host)
    const matches = await Match.find({
      $or: [
        { seekerUserId: req.user._id, status: 'connected' },
      ],
    }).populate({
      path: 'matchedProfileId',
      populate: { path: 'userId', select: 'name email profilePhotoUrl' },
    });

    const conversations = await Promise.all(
      matches.map(async (match) => {
        const lastMessage = await Message.findOne({ matchId: match._id }).sort({ createdAt: -1 });
        return {
          matchId: match._id,
          matchedProfile: match.matchedProfileId,
          lastMessage: lastMessage ? lastMessage.content : 'Connection accepted! Say hi 👋',
          lastMessageTime: lastMessage ? lastMessage.createdAt : match.updatedAt,
          compatibilityScore: match.compatibilityScore,
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get message thread for a match
// @route   GET /api/chat/:matchId/messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ matchId: req.params.matchId })
      .populate('senderId', 'name profilePhotoUrl')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message in a connected match
// @route   POST /api/chat/:matchId/messages
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const match = await Match.findById(req.params.matchId).populate({
      path: 'matchedProfileId',
      select: 'userId',
    });

    if (!match || match.status !== 'connected') {
      return res.status(403).json({ message: 'You can only message users after connecting' });
    }

    const matchedUserId = match.matchedProfileId.userId.toString();
    const isSeeker = match.seekerUserId.toString() === req.user._id.toString();
    const receiverId = isSeeker ? matchedUserId : match.seekerUserId;

    const message = await Message.create({
      matchId: match._id,
      senderId: req.user._id,
      receiverId,
      content: content.trim(),
    });

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name profilePhotoUrl');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
