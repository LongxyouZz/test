-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create media table for images and videos
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  alt_text VARCHAR(255),
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create content_analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for content table
DROP POLICY IF EXISTS "Users can view published content" ON content;
CREATE POLICY "Users can view published content"
  ON content FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Content creators can manage their own content" ON content;
CREATE POLICY "Content creators can manage their own content"
  ON content FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all content" ON content;
CREATE POLICY "Admins can manage all content"
  ON content FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for media table
DROP POLICY IF EXISTS "Users can view published media" ON media;
CREATE POLICY "Users can view published media"
  ON media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM content
    WHERE content.id = media.content_id AND content.status = 'published'
  ));

DROP POLICY IF EXISTS "Content creators can manage their own media" ON media;
CREATE POLICY "Content creators can manage their own media"
  ON media FOR ALL
  USING (EXISTS (
    SELECT 1 FROM content
    WHERE content.id = media.content_id AND content.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can manage all media" ON media;
CREATE POLICY "Admins can manage all media"
  ON media FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for user_roles table
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
CREATE POLICY "Admins can manage user roles"
  ON user_roles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Create policies for content_analytics table
DROP POLICY IF EXISTS "Content creators can view their own analytics" ON content_analytics;
CREATE POLICY "Content creators can view their own analytics"
  ON content_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM content
    WHERE content.id = content_analytics.content_id AND content.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can view all analytics" ON content_analytics;
CREATE POLICY "Admins can view all analytics"
  ON content_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Enable realtime for all tables
alter publication supabase_realtime add table content;
alter publication supabase_realtime add table media;
alter publication supabase_realtime add table user_roles;
alter publication supabase_realtime add table content_analytics;