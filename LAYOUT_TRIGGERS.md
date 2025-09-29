# 🎨 Layout Triggers Guide

Use layout triggers in your Notion content to control how sections are rendered on your case study pages.

## 📝 How to Use Layout Triggers

### Method 1: Callout Blocks (Recommended)
Create a callout block at the beginning of a section with the layout trigger:

```
💡 layout:hero-overlay
```

### Method 2: Hidden Comments in Paragraphs
Add an HTML comment at the beginning of a paragraph:

```
<!-- layout:two-column -->
```

### Method 3: Heading Brackets
Add the layout trigger in square brackets within a heading:

```
## [layout:fullwidth-diagram] Discover
```

## 🎯 Available Layout Types

### `hero-overlay`
**Perfect for**: Opening sections with impact
**Content**: Heading + Paragraph + Image
**Result**: Full-width hero image with overlaid text

```
💡 layout:hero-overlay

# Marketplace Onboarding
Led product strategy and design to revamp a legacy onboarding system...
[Upload hero image]
```

### `fullwidth-diagram`
**Perfect for**: Service blueprints, process flows, complex diagrams
**Content**: Heading + Paragraph + Image
**Result**: Large diagrams with proper aspect ratios and shadows

```
💡 layout:fullwidth-diagram

## Discover
We mapped the entire onboarding process...
[Upload service blueprint diagram]
```

### `two-column`
**Perfect for**: Side-by-side content with images
**Content**: Heading + Multiple Paragraphs + Image
**Result**: Text on left, image on right

```
💡 layout:two-column

## Early Concept Shaping
We started with mobile-first approach...
We iterated on the user flow...
[Upload mobile interface screenshot]
```

### `image-gallery`
**Perfect for**: UI mockups, wireframes, process steps
**Content**: Heading + Multiple Images
**Result**: Responsive grid with hover effects

```
💡 layout:image-gallery

## Prioritised User Testing
[Upload screenshot 1]
[Upload screenshot 2]
[Upload screenshot 3]
[Upload screenshot 4]
[Upload screenshot 5]
```

### `centered`
**Perfect for**: Simple, focused content
**Content**: Heading + Paragraph
**Result**: Centered text with max-width constraint

```
💡 layout:centered

## Our Approach
We focused on reducing cognitive load and improving user guidance...
```

### `comparison`
**Perfect for**: Before/after, A/B testing results
**Content**: Heading + Paragraph + Image + Paragraph + Image
**Result**: Side-by-side comparison layout

```
💡 layout:comparison

## Results

Before: The old system was confusing...
[Upload old system screenshot]

After: The new system provides clear guidance...
[Upload new system screenshot]
```

## 🚀 Best Practices

1. **Place triggers early**: Put layout triggers in the first 3 blocks of a section
2. **Use callouts**: Callout blocks are the most visible and maintainable
3. **Test layouts**: Preview your content to ensure layouts work as expected
4. **Keep content simple**: Focus on content, let the system handle styling
5. **Use descriptive headings**: Good headings improve SEO and readability

## 🔧 Technical Notes

- Layout triggers are automatically filtered out and won't appear in the rendered content
- The system processes blocks sequentially and applies the first matching layout
- Fallback to standard rendering occurs when no layout trigger is detected
- All layouts are responsive and work on mobile and desktop

## 📱 Mobile Considerations

All layouts automatically adapt to mobile screens:
- `two-column` becomes stacked on mobile
- `image-gallery` adjusts grid columns
- `hero-overlay` maintains aspect ratio
- Text sizes and spacing scale appropriately

## 🎨 Customization

To add new layout types:
1. Add the pattern to `LAYOUT_PATTERNS` in `DynamicLayout.tsx`
2. Create the layout component
3. Add the case to the switch statement
4. Update this documentation

## 💡 Tips for Great Results

- **High-quality images**: Upload images at least 1200px wide for best results
- **Consistent structure**: Follow the recommended content patterns for each layout
- **Clear headings**: Use descriptive headings that work well in the layout
- **Test on mobile**: Always preview on mobile devices to ensure readability
