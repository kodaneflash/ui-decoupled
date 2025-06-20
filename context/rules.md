# Ledger Live Mobile UI Replication Rules

## Core Architecture Principles

### 1. Component Separation Pattern
**Rule**: Always separate layout logic from content logic
- **Text components** handle typography and content only
- **Flex components** handle all layout, positioning, and spacing
- **Never apply flex properties directly to Text components**

```tsx
// ❌ WRONG - Text with flex properties
<Text variant="large" flexGrow={1} flexShrink={1}>Content</Text>

// ✅ CORRECT - Wrap Text in Flex for layout
<Flex flexGrow={1} flexShrink={1}>
  <Text variant="large">Content</Text>
</Flex>
```

### 2. Theme Structure
**Rule**: Use proper theme configuration matching Ledger Live architecture
```tsx
// Required theme structure
const theme = useMemo(() => ({
  ...defaultTheme,
  colors: {
    ...selectedTheme.colors,
    ...palettes[selectedPalette],
    palette: palettes[selectedPalette],
  },
  theme: selectedPalette,
}), [selectedTheme.colors, selectedPalette]);
```

## Text Component Guidelines

### 1. Typography Properties
**Allowed Text props**:
- `variant` (required): "h4", "large", "body", "small", "paragraph"
- `fontWeight`: "regular", "medium", "semiBold", "bold"
- `color`: Use theme tokens like "neutral.c100", "neutral.c70"
- `numberOfLines`: For text truncation
- `fontSize`: Only when variant doesn't provide the right size

### 2. Forbidden Text Properties
**Never use these on Text components**:
- `flex`, `flexGrow`, `flexShrink`, `flexBasis`
- `margin`, `padding` (use `m`, `p` variants on Flex instead)
- `textAlign` (not supported in native-ui Text)
- `width`, `height` (wrap in Flex for sizing)

```tsx
// ❌ WRONG
<Text mb={1} flex={1} textAlign="center">Content</Text>

// ✅ CORRECT
<Flex mb={1} flex={1} alignItems="center">
  <Text>Content</Text>
</Flex>
```

## Layout & Spacing Guidelines

### 1. Spacing System
**Rule**: Use consistent spacing props on Flex components
- `px`, `py`, `pt`, `pb`, `pl`, `pr` for padding
- `mx`, `my`, `mt`, `mb`, `ml`, `mr` for margin
- Values: Use numbers (1-12) that map to theme spacing scale

### 2. Container Patterns
**Common layout patterns**:

```tsx
// Row layout with space between
<Flex flexDirection="row" justifyContent="space-between" alignItems="center">
  <Flex flex={1}>Left content</Flex>
  <Flex>Right content</Flex>
</Flex>

// Column with controlled flex
<Flex flexDirection="column" flexShrink={1} flexGrow={1}>
  <Text>Title</Text>
  <Text>Subtitle</Text>
</Flex>

// Icon + Text alignment
<Flex flexDirection="row" alignItems="center">
  <Icon />
  <Flex ml={3}>
    <Text>Label</Text>
  </Flex>
</Flex>
```

## Color & Theming Rules

### 1. Color Tokens
**Rule**: Always use semantic color tokens, never hardcoded colors
```tsx
// ✅ CORRECT - Semantic tokens
color="neutral.c100"    // Primary text
color="neutral.c70"     // Secondary text
color="primary.c80"     // Primary brand color
backgroundColor="background.main"

// ❌ WRONG - Hardcoded colors
color="#FFFFFF"
backgroundColor="#131214"
```

### 2. Theme Access
**Rule**: Access theme through proper channels
```tsx
// For styled-components
const { colors, space } = useTheme();

// For component props
backgroundColor={colors.background.main}
```

## Component Architecture

### 1. Container vs Presentational
**Rule**: Separate data logic from UI logic
- **Container components**: Handle data, state, business logic
- **Presentational components**: Pure UI, receive data via props
- **Static replica**: Replace containers with simple wrappers passing hardcoded data

### 2. Prop Interfaces
**Rule**: Define clear, typed interfaces
```tsx
type Props = {
  name: string;
  balance: BigNumber;
  currency: Currency;
  onPress?: () => void;
};

// Use React.memo for performance
export default React.memo<Props>(ComponentName);
```

## Asset & Icon Guidelines

### 1. Icon Usage
**Rule**: Use @ledgerhq/native-ui icons consistently
```tsx
import { IconsLegacy } from '@ledgerhq/native-ui/assets/icons';

// Standard sizing
<IconsLegacy.ChevronRightMedium size={24} color="neutral.c100" />
```

### 2. Cryptocurrency Icons
**Rule**: Create consistent circular icons for crypto assets
```tsx
const CryptoIcon = styled(Flex).attrs({
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
})<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
`;
```

## Styling Patterns

### 1. Styled Components
**Rule**: Use styled-components for reusable, configurable components
```tsx
const TabButton = styled(Flex).attrs({
  paddingX: 4,
  paddingY: 2,
  borderRadius: 6,
})<{ isActive?: boolean }>`
  background-color: ${props => props.isActive ? '#7C3AED' : '#2A2A2A'};
`;
```

### 2. Conditional Styling
**Rule**: Handle state-based styling through props
```tsx
// ✅ CORRECT - Props-based conditional styling
<TabButton isActive={selectedTab === 'crypto'}>

// ❌ WRONG - Inline conditional styles
style={{ backgroundColor: isActive ? '#7C3AED' : '#2A2A2A' }}
```

## Performance Rules

### 1. Memoization
**Rule**: Memoize components and callbacks appropriately
```tsx
// Component memoization
export default React.memo<Props>(ComponentName);

// Callback memoization for list items
const renderItem = useCallback(({ item }) => (
  <ItemComponent item={item} />
), []);
```

### 2. List Rendering
**Rule**: Use FlatList for any list with more than 3 items
```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  showsVerticalScrollIndicator={false}
/>
```

## Static Data Guidelines

### 1. Mock Data Structure
**Rule**: Match original data structures exactly
```tsx
// Maintain same prop interfaces as original
const mockAccounts: AccountLike[] = [
  {
    id: 'bitcoin-1',
    name: 'Bitcoin',
    balance: new BigNumber('0'),
    currency: { /* full currency object */ }
  }
];
```

### 2. Hardcoded Values
**Rule**: Use realistic, consistent mock data
- Balances: Always use `new BigNumber('0')` for empty state
- Names: Use real cryptocurrency names
- Colors: Use official brand colors for crypto assets
- Icons: Use Unicode symbols or letters as placeholders

## Testing & Validation

### 1. Visual Fidelity Checklist
- [ ] Spacing matches pixel-perfect to original
- [ ] Typography (size, weight, color) is identical
- [ ] Icons are correctly sized and positioned
- [ ] Color tokens are used (no hardcoded colors)
- [ ] Responsive behavior matches original
- [ ] Touch targets are appropriately sized

### 2. Code Quality Checklist
- [ ] No TypeScript errors
- [ ] Text components have no flex properties
- [ ] Proper theme structure is used
- [ ] Components are memoized where appropriate
- [ ] Styled-components follow naming conventions
- [ ] Props interfaces are properly typed

## Common Pitfalls to Avoid

1. **Text Flex Properties**: Never put layout props on Text components
2. **Hardcoded Colors**: Always use theme tokens
3. **Missing Memoization**: Can cause performance issues in lists
4. **Improper Theme Access**: Use useTheme() correctly
5. **SVG Dependencies**: Install react-native-svg for custom graphics
6. **Import Paths**: Use proper alias resolution (~/ for src/)
7. **Native-UI Props**: Don't mix React Native props with native-ui props

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── StyleProvider.tsx
│   ├── AccountRowLayout.tsx
│   └── GraphCard.tsx
├── screens/            # Screen-level components
│   └── Portfolio/
│       └── index.tsx
├── styles/            # Theme and color definitions
│   └── colors.ts
└── mock/              # Static data for replica
    ├── useAccounts.ts
    └── usePortfolio.ts
```

This structure ensures maintainability and follows Ledger Live's architectural patterns. 