# Notion CMS Setup Guide

This guide will help you set up Notion as your CMS database for your Next.js portfolio.

## Prerequisites

- A Notion account
- Access to create integrations in Notion

## Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: `Portfolio CMS` (or any name you prefer)
   - **Logo**: Optional
   - **Associated workspace**: Select your workspace
4. Click **"Submit"**
5. Copy the **Internal Integration Token** (starts with `secret_`)

## Step 2: Create Your Portfolio Database

1. In Notion, create a new page or go to an existing page
2. Type `/database` and select **"Table - Full page"**
3. Set up your database with these columns:
   - **Title** (Title property) - for case study titles
   - **Slug** (Text property) - for URL-friendly identifiers
   - **Summary** (Text property) - for case study descriptions
   - **Role** (Text property) - for your role in the project
   - **Year** (Number property) - for project year
   - **Cover Image** (URL property) - for cover images

## Step 3: Share Database with Integration

1. In your database, click the **"Share"** button (top right)
2. Click **"Add people, emails, groups, or integrations"**
3. Search for your integration name (`Portfolio CMS`)
4. Click on it and give it **"Can read"** permissions
5. Click **"Invite"**

## Step 4: Get Your Database ID

1. Open your database in Notion
2. Look at the URL: `https://www.notion.so/your-workspace/DATABASE_ID?v=view_id`
3. Copy the `DATABASE_ID` (32-character string between the last `/` and `?v=`)

## Step 5: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```bash
# Your Notion integration token (from Step 1)
NOTION_API_TOKEN=secret_your_actual_token_here

# Your database ID (from Step 4) - must include dashes
NOTION_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit your portfolio to see if case studies are loading from Notion

## Database Schema Reference

Your Notion database should have these properties:

| Property Name | Type | Required | Description |
|---------------|------|----------|-------------|
| Title | Title | Yes | Case study title |
| Slug | Text | Yes | URL-friendly identifier |
| Summary | Text | No | Short description |
| Role | Text | No | Your role in the project |
| Year | Number | No | Project year |
| Cover Image | URL | No | Cover image URL |

## Troubleshooting

### Common Issues:

1. **"Unauthorized" errors**: Make sure you've shared the database with your integration
2. **"Database not found"**: Verify your database ID is correct
3. **Empty results**: Check that your database has pages and they're published
4. **Property errors**: Ensure your database has the required properties with correct types

### Debug Mode:

Add this to your `.env.local` for debugging:
```bash
DEBUG=true
```

## Next Steps

- Add content to your Notion database
- Customize the case study templates
- Set up additional Notion pages for other content types
- Configure webhooks for automatic updates (optional)

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Notion integration token secure
- Use environment variables in production deployments
