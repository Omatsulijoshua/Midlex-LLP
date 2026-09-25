import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/message_model.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../services/directory_service.dart';

class TeamChatScreen extends StatefulWidget {
  final String? teamName;

  const TeamChatScreen({super.key, this.teamName});

  @override
  State<TeamChatScreen> createState() => _TeamChatScreenState();
}

class _TeamChatScreenState extends State<TeamChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  List<MessageModel> _messages = [];
  List<String> _availableTeams = [];
  late String _activeTeam;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initTeam();
  }

  Future<void> _initTeam() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    final teams = await DirectoryService.getTeams();
    final defaultTeam = widget.teamName ?? user?.litigationTeam ?? (teams.isNotEmpty ? teams.first : 'TEAM ANCHOR');

    setState(() {
      _availableTeams = teams;
      _activeTeam = defaultTeam;
    });

    await _fetchMessages();
  }

  Future<void> _fetchMessages() async {
    setState(() => _isLoading = true);
    try {
      final encoded = Uri.encodeComponent(_activeTeam);
      final data = await ApiService.get('/users/team-messages/$encoded');
      if (data is List) {
        setState(() {
          _messages = data.map((e) => MessageModel.fromJson(e)).toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _messages = [];
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _messages = [];
        _isLoading = false;
      });
    }
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    _messageController.clear();
    try {
      final encoded = Uri.encodeComponent(_activeTeam);
      await ApiService.post('/users/team-messages/$encoded', {
        'content': text,
      });
      await _fetchMessages();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to send message: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = Provider.of<AuthProvider>(context).user;
    final isAdmin = currentUser?.isAdmin == true;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.shield_outlined, size: 18, color: AppTheme.secondary),
                const SizedBox(width: 6),
                Text('$_activeTeam Group Chat', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              ],
            ),
            const Text(
              'Litigation & Advocacy Internal Room',
              style: TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          if (isAdmin)
            PopupMenuButton<String>(
              icon: const Icon(Icons.swap_horiz, color: Colors.white),
              tooltip: 'Switch Litigation Team Room',
              onSelected: (team) {
                setState(() {
                  _activeTeam = team;
                });
                _fetchMessages();
              },
              itemBuilder: (context) => _availableTeams.map((t) {
                return PopupMenuItem<String>(
                  value: t,
                  child: Row(
                    children: [
                      Icon(Icons.shield, size: 16, color: t == _activeTeam ? AppTheme.secondary : Colors.grey),
                      const SizedBox(width: 8),
                      Text(t, style: TextStyle(fontWeight: t == _activeTeam ? FontWeight.bold : FontWeight.normal)),
                    ],
                  ),
                );
              }).toList(),
            ),
        ],
      ),
      body: Column(
        children: [
          // Banner Notice
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: AppTheme.accentLight,
            child: Row(
              children: [
                const Icon(Icons.lock_outline, size: 16, color: AppTheme.primary),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Litigation Team Channel: Only lawyers & admins assigned to $_activeTeam can view or send messages here.',
                    style: const TextStyle(fontSize: 11, color: AppTheme.primary, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),

          // Messages List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _messages.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.shield_outlined, size: 48, color: Colors.grey),
                            const SizedBox(height: 12),
                            Text(
                              'Welcome to $_activeTeam Group Chat!',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                            ),
                            const SizedBox(height: 4),
                            const Text('No messages sent yet. Start the discussion below.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _messages.length,
                        itemBuilder: (context, index) {
                          final msg = _messages[index];
                          final isMe = msg.senderId == currentUser?.id;

                          return Align(
                            alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              constraints: BoxConstraints(
                                maxWidth: MediaQuery.of(context).size.width * 0.78,
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              decoration: BoxDecoration(
                                color: isMe ? AppTheme.primary : Colors.white,
                                borderRadius: BorderRadius.only(
                                  topLeft: const Radius.circular(16),
                                  topRight: const Radius.circular(16),
                                  bottomLeft: Radius.circular(isMe ? 16 : 0),
                                  bottomRight: Radius.circular(isMe ? 0 : 16),
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.05),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                                border: isMe ? null : Border.all(color: Colors.grey.shade200),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        msg.senderName,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 11,
                                          color: isMe ? AppTheme.secondary : AppTheme.primary,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        msg.formattedTime,
                                        style: TextStyle(
                                          fontSize: 9,
                                          color: isMe ? Colors.white60 : Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    msg.content ?? '',
                                    style: TextStyle(
                                      color: isMe ? Colors.white : AppTheme.textDark,
                                      fontSize: 13,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
          ),

          // Message Input Field
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: const TextStyle(color: AppTheme.textDark, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Message $_activeTeam counsel...',
                      hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      fillColor: AppTheme.accentLight,
                      filled: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                CircleAvatar(
                  backgroundColor: AppTheme.secondary,
                  radius: 22,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 18),
                    onPressed: _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
