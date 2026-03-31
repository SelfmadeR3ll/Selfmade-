import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useUserStore } from '../stores/userStore';
import { streamVitaChat, buildVitaSystemPrompt, ChatMessage } from '../lib/claude';
import { Colors, FontSize, Radius, Spacing } from '../constants/theme';

const FREE_LIMIT = 5;

export function VitaBubble() {
  const { isVitaBubbleExpanded, toggleVitaBubble, setVitaBubbleExpanded, profile, dailyStats,
          subscriptionTier, vitaMessageCount, incrementVitaMessageCount } = useUserStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const canSendMessage =
    subscriptionTier !== 'free' || vitaMessageCount < FREE_LIMIT;

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming || !canSendMessage) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    incrementVitaMessageCount();
    setIsStreaming(true);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMsg]);

    const systemPrompt = buildVitaSystemPrompt(profile, dailyStats);

    await streamVitaChat(
      newMessages,
      systemPrompt,
      (chunk) => {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant') {
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
          }
          return prev;
        });
      },
      () => setIsStreaming(false),
      (err) => {
        console.error('Vita stream error:', err);
        setIsStreaming(false);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant' && !last.content) {
            return [
              ...prev.slice(0, -1),
              { role: 'assistant', content: "I'm having trouble connecting right now. Please check your API key in settings." },
            ];
          }
          return prev;
        });
      }
    );
  };

  if (!isVitaBubbleExpanded) {
    return (
      <TouchableOpacity
        style={styles.bubble}
        onPress={toggleVitaBubble}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#00C896', '#7C5CFC']}
          style={styles.bubbleGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bubbleEmoji}>✦</Text>
        </LinearGradient>
        {vitaMessageCount > 0 && subscriptionTier === 'free' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{FREE_LIMIT - vitaMessageCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.expanded}
    >
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.expandedInner}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.vitaAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.vitaAvatarText}>V</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.vitaName}>Vita AI</Text>
            <Text style={styles.vitaStatus}>
              {subscriptionTier === 'free'
                ? `${Math.max(0, FREE_LIMIT - vitaMessageCount)} messages left today`
                : 'Your health + money coach'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setVitaBubbleExpanded(false)} hitSlop={12}>
            <Ionicons name="chevron-down" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          style={styles.messageList}
          contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✦</Text>
              <Text style={styles.emptyText}>
                Hi {profile?.name ?? 'there'}! I'm Vita — your AI coach for health and money.{'\n'}
                Ask me anything!
              </Text>
              <View style={styles.quickChips}>
                {['Plan my week', 'What should I eat?', 'Review my spending', 'Optimize my sleep'].map(
                  (chip) => (
                    <TouchableOpacity
                      key={chip}
                      style={styles.chip}
                      onPress={() => sendMessage(chip)}
                    >
                      <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {item.role === 'assistant' && !item.content && isStreaming ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text
                  style={[
                    styles.messageText,
                    item.role === 'user' ? styles.userText : styles.assistantText,
                  ]}
                >
                  {item.content}
                </Text>
              )}
            </View>
          )}
        />

        {/* Input */}
        {!canSendMessage ? (
          <View style={styles.limitBanner}>
            <Text style={styles.limitText}>
              Daily limit reached. Upgrade to Pro for unlimited Vita AI.
            </Text>
          </View>
        ) : (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ask Vita anything..."
              placeholderTextColor={Colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(inputText)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendBtn, { opacity: inputText.trim() && !isStreaming ? 1 : 0.4 }]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isStreaming}
            >
              <LinearGradient colors={['#00C896', '#7C5CFC']} style={styles.sendGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name="arrow-up" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999,
  },
  bubbleGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleEmoji: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.orange,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  expanded: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  expandedInner: {
    flex: 1,
    backgroundColor: 'rgba(13,17,26,0.9)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  vitaAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitaAvatarText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: FontSize.md,
  },
  vitaName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: FontSize.md,
  },
  vitaStatus: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  messageList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyEmoji: {
    fontSize: 32,
    color: Colors.primary,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing.sm + 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface2,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FontSize.md,
    lineHeight: 21,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitBanner: {
    margin: Spacing.md,
    padding: Spacing.md,
    backgroundColor: `${Colors.orange}20`,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: `${Colors.orange}40`,
  },
  limitText: {
    color: Colors.orange,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});
