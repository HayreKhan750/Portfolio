# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

## 2. Run Migrations

In your Supabase project dashboard:

1. Go to SQL Editor
2. Run `001_initial_schema.sql` (creates tables and RLS policies)
3. Run `002_seed_data.sql` (adds sample data - optional)

## 3. Create Storage Buckets

Go to Storage and create these public buckets:
- `profile` - For profile pictures
- `projects` - For project images
- `certificates` - For certificate proof images

## 4. Set Up Admin User

To grant admin access, run in SQL Editor:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

Get your user ID from the Auth > Users section.

## 5. Update Environment Variables

Add to your `.env` file:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Security Notes

- All tables have RLS enabled
- Public can read portfolio content
- Only admins can write/update
- Messages table allows public inserts for contact form
