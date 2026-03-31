import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { streamVitaChat, buildVitaSystemPrompt, ChatMessage } from '../../lib/claude';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';

const FREE_LIMIT = 5;

const QUICK_PROMPTS = [
  'Plan my week',
  'What should I eat today?',
  'Review my spending',
  'Optimize my sleep',
  'Create a workout plan',
  'Help me save more money',
];

export default function VitaTab() {
  const {
    profile, dailyStats, subscriptionTier, vitaMessageCount,
    incrementVitaMessageCount,
  } = useUserStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const canSend = subscriptionTier !== 'free' || vitaMessageCount < FREE_LIMIT;
  const systemPrompt = buildVitaSystemPrompt(profile, dailyStats);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    if (!canSend) {
      Alert.alert(
        'Daily Limit Reached',
        'You\'ve used all 5 free Vita messages today. Upgrade to Pro for unlimited access.',
        [
          { text: 'Upgrade', onPress: () => router.push('/screens/billing') },
          { text: 'Later', style: 'cancel' },
        ]
      );
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    incrementVitaMessageCount();
    setIsStreaming(true);

    const assistantMsg: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMsg]);

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
        flatListRef.current?.scrollToEnd({ animated: false });
      },
      () => {
        setIsStreaming(false);
      },
      (err) => {
        console.error('Vita error:', err);
        setIsStreaming(false);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant' && !last.content) {
            return [
              ...prev.slice(0, -1),
              {
                role: 'assistant',
                content:
                  "I'm having trouble connecting. Make sure your ANTHROPIC_API_KEY is configured in your .env file.",
              },
            ];
          }
          return prev;
        });
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={['#00C896', '#7C5CFC']}
              style={styles.vitaAvatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.vitaAvatarText}>V</Text>
            </LinearGradient>
            <View>
              <Text style={styles.vitaName}>Vita AI</Text>
              <Text style={styles.vitaSubtitle}>
                {subscriptionTier === 'free'
                  ? `${Math.max(0, FREE_LIMIT - vitaMessageCount)} free messages left`
                  : 'Health + Money Coach · Pro'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setMessages([])} hitSlop={12}>
            <Ionicons name="refresh-outline" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['#00C896', '#7C5CFC']}
                style={styles.emptyOrb}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.emptyOrbText}>✦</Text>
              </LinearGradient>
              <Text style={styles.emptyTitle}>Hi {profile?.name ?? 'there'}!</Text>
              <Text style={styles.emptySubtitle}>
                I'm Vita — your AI coach for health and money. I know your goals, your budget, and your body stats. Ask me anything.
              </Text>

              <View style={styles.quickChips}>
                {QUICK_PROMPTS.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    style={styles.chip}
                    onPress={() => sendMessage(prompt)}
                    disabled={!canSend}
                  >
                    <Text style={styles.chipText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          }
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.messageBubble,
                item.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              {item.role === 'assistant' && (
                <LinearGradient
                  colors={['#00C896', '#7C5CFC']}
                  style={styles.msgAvatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>V</Text>
                </LinearGradient>
              )}
              <View
                style={[
                  styles.msgContent,
                  item.role === 'user' ? styles.userContent : styles.assistantContent,
                ]}
              >
                {item.role === 'assistant' && !item.content && isStreaming ? (
                  <View style={styles.typingDots}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.typingText}>Vita is thinking...</Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.msgText,
                      item.role === 'user' ? styles.userMsgText : styles.assistantMsgText,
                    ]}
                  >
                    {item.content}
                  </Text>
                )}
              </View>
            </View>
          )}
        />

        {/* Limit warning */}
        {subscriptionTier === 'free' && vitaMessageCount >= FREE_LIMIT - 1 && (
          <View style={styles.limitWarning}>
            <Text style={styles.limitText}>
              {vitaMessageCount >= FREE_LIMIT
                ? '🔒 Daily limit reached — '
                : `⚠️ Last free message — `}
            </Text>
            <TouchableOpacity onPress={() => router.push('/screens/billing')}>
              <Text style={styles.limitLink}>Upgrade to Pro</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={canSend ? 'Ask Vita anything...' : 'Upgrade for more messages'}
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            editable={canSend && !isStreaming}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { opacity: inputText.trim() && !isStreaming && canSend ? 1 : 0.4 },
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isStreaming || !canSend}
          >
            <LinearGradient
              colors={['#00C896', '#7C5CFC']}
              style={styles.sendGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={isStreaming ? 'stop' : 'arrow-up'} size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  vitaAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  vitaAvatarText: { color: '#fff', fontWeight: '800', fontSize: FontSize.lg },
  vitaName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  vitaSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  messagesList: { padding: Spacing.lg, gap: Spacing.md, flexGrow: 1 },
  emptyState: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.md },
  emptyOrb: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  emptyOrbText: { fontSize: 32, color: '#fff' },
  emptyTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.xl,
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
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  messageBubble: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-end' },
  userBubble: { flexDirection: 'row-reverse' },
  assistantBubble: {},
  msgAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgContent: {
    maxWidth: '80%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  userContent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantContent: {
    backgroundColor: Colors.surface2,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  msgText: { fontSize: FontSize.md, lineHeight: 22 },
  userMsgText: { color: '#fff' },
  assistantMsgText: { color: Colors.textPrimary },
  typingDots: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  typingText: { color: Colors.textMuted, fontSize: FontSize.sm },
  limitWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: `${Colors.orange}15`,
    borderTopWidth: 1,
    borderTopColor: `${Colors.orange}30`,
  },
  limitText: { color: Colors.orange, fontSize: FontSize.sm },
  limitLink: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '700', textDecorationLine: 'underline' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', flexShrink: 0 },
  sendGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
