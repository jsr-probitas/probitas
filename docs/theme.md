# Theme Layer

The Theme layer provides semantic coloring for the Reporter layer. Reporters
format output based on meaning (success, failure) rather than colors (green,
red).

## Design Philosophy

### Semantic Abstraction

Theme methods are named for meaning, not appearance:

| Method    | Meaning             | Default Color |
| --------- | ------------------- | ------------- |
| `success` | Test passed         | Green         |
| `failure` | Test failed         | Red           |
| `warning` | Needs attention     | Yellow        |
| `info`    | Informational       | Cyan          |
| `dim`     | Secondary/auxiliary | Gray          |
| `title`   | Heading/emphasis    | Bold          |

This abstraction provides:

- **Consistency** - Same meaning always styled the same way
- **Customization** - Change colors without modifying reporters
- **Accessibility** - Easy to create high-contrast or colorblind-friendly themes

### NO_COLOR Support

Themes can implement the [NO_COLOR](https://no-color.org/) standard by returning
text unmodified. The built-in `noColorTheme` does this.

## Theme Interface

Each theme provides six methods, all with signature `(text: string) => string`:

- `success` - Passed tests, positive outcomes
- `failure` - Failed tests, errors
- `warning` - Warnings, deprecations
- `info` - Informational messages
- `dim` - File paths, timestamps, secondary info
- `title` - Section headers, scenario names

## Built-in Themes

### defaultTheme

Standard theme using ANSI colors:

- success: green
- failure: red
- warning: yellow
- info: cyan
- dim: gray
- title: bold

### noColorTheme

Returns text unmodified. Used when `NO_COLOR` environment variable is set or
`noColor: true` is passed to reporter.

## Custom Themes

Create a theme by implementing all six methods:

```typescript
const customTheme: Theme = {
  success: (text) => `✓ ${text}`,
  failure: (text) => `✗ ${text}`,
  warning: (text) => `⚠ ${text}`,
  info: (text) => `ℹ ${text}`,
  dim: (text) => `(${text})`,
  title: (text) => `## ${text}`,
};
```

Pass to reporter via options:

```typescript
new ListReporter({ theme: customTheme });
```

## Best Practices

1. **Use semantically** - Call `theme.success()` for passing, not for "green"
2. **Implement all methods** - Themes must provide all six
3. **Support NO_COLOR** - Check environment variable when creating themes
4. **Keep it readable** - Ensure sufficient contrast in custom themes

## Related

- [Architecture](./architecture.md) - Overall design
- [Reporter](./reporter.md) - Theme consumer
