-- Create tables for the tea-fortune application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Themes table
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  bg_color TEXT NOT NULL,
  border_color TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  theme_id TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  sku TEXT NOT NULL UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0,
  weight TEXT,
  dimensions TEXT,
  description TEXT,
  short_description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false
);

-- Product images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  country_code TEXT,
  tea_love_reason TEXT
);

-- Fortunes table (stores fortune messages)
CREATE TABLE fortunes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  theme_id TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT,
  weather TEXT
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipping_address JSONB,
  billing_address JSONB,
  shipping_method TEXT,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  notes TEXT
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL
);

-- Cart table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  UNIQUE(user_id, theme_id)
);

-- Message templates table
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personalization rules table
CREATE TABLE personalization_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_fortunes_user_id ON fortunes(user_id);
CREATE INDEX idx_fortunes_theme_id ON fortunes(theme_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_products_theme_id ON products(theme_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_message_templates_theme_id ON message_templates(theme_id);

-- Create RLS policies
-- Allow authenticated users to select their own profile
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Allow anyone to view active themes
CREATE POLICY "Anyone can view active themes"
ON themes
FOR SELECT
USING (active = true);

-- Allow admins to manage themes
CREATE POLICY "Admins can manage themes"
ON themes
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Allow anyone to view active products
CREATE POLICY "Anyone can view active products"
ON products
FOR SELECT
USING (active = true);

-- Allow admins to manage products
CREATE POLICY "Admins can manage products"
ON products
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Allow anyone to view product images
CREATE POLICY "Anyone can view product images"
ON product_images
FOR SELECT
USING (true);

-- Allow admins to manage product images
CREATE POLICY "Admins can manage product images"
ON product_images
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Allow authenticated users to create fortunes
CREATE POLICY "Authenticated users can create fortunes"
ON fortunes
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view their own fortunes
CREATE POLICY "Users can view their own fortunes"
ON fortunes
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to manage their own carts
CREATE POLICY "Users can manage their own carts"
ON carts
FOR ALL
USING (auth.uid() = user_id);

-- Allow users to manage their own cart items
CREATE POLICY "Users can manage their own cart items"
ON cart_items
FOR ALL
USING (cart_id IN (
  SELECT id FROM carts WHERE user_id = auth.uid()
));

-- Allow users to view their own orders
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to view their own order items
CREATE POLICY "Users can view their own order items"
ON order_items
FOR SELECT
USING (order_id IN (
  SELECT id FROM orders WHERE user_id = auth.uid()
));

-- Allow users to manage their own preferences
CREATE POLICY "Users can manage their own preferences"
ON user_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Allow anyone to view message templates
CREATE POLICY "Anyone can view message templates"
ON message_templates
FOR SELECT
USING (true);

-- Allow admins to manage message templates
CREATE POLICY "Admins can manage message templates"
ON message_templates
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Allow admins to manage personalization rules
CREATE POLICY "Admins can manage personalization rules"
ON personalization_rules
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create a cart for the new user
  INSERT INTO public.carts (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update product stock when order is placed
CREATE OR REPLACE FUNCTION public.update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stock when order status changes to 'processing'
  IF NEW.status = 'processing' AND (OLD.status IS NULL OR OLD.status != 'processing') THEN
    UPDATE products
    SET stock = stock - oi.quantity
    FROM order_items oi
    WHERE products.id = oi.product_id
    AND oi.order_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update product stock
CREATE TRIGGER on_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION public.update_product_stock();

-- Create function to update order totals when items change
CREATE OR REPLACE FUNCTION public.update_order_totals()
RETURNS TRIGGER AS $$
DECLARE
  order_subtotal DECIMAL(10, 2);
  tax_rate DECIMAL(10, 2) := 0.08; -- Assume 8% tax rate
BEGIN
  -- Calculate subtotal
  SELECT COALESCE(SUM(total), 0) INTO order_subtotal
  FROM order_items
  WHERE order_id = NEW.order_id;
  
  -- Update order
  UPDATE orders
  SET
    subtotal = order_subtotal,
    tax = order_subtotal * tax_rate,
    total = order_subtotal + (order_subtotal * tax_rate) + shipping_cost,
    updated_at = NOW()
  WHERE id = NEW.order_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update order totals
CREATE TRIGGER on_order_item_change
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION public.update_order_totals();

-- Insert initial themes data
INSERT INTO themes (id, name, description, bg_color, border_color)
VALUES
  ('inspiration', 'Inspiration', 'A blend designed to ignite your creative spark and fuel your imagination.', 'bg-amber-50', 'border-amber-500'),
  ('serenity', 'Serenity', 'Find your center with this calming blend that promotes peace and tranquility.', 'bg-blue-50', 'border-blue-500'),
  ('adventure', 'Adventure', 'Embark on new journeys with this bold blend that awakens your spirit of exploration.', 'bg-green-50', 'border-green-500'),
  ('joy', 'Joy', 'Celebrate life''s moments with this uplifting blend that brings happiness with every sip.', 'bg-yellow-50', 'border-yellow-500'),
  ('well-being', 'Well-being', 'Nurture your body and mind with this wholesome blend crafted for overall wellness.', 'bg-red-50', 'border-red-500'),
  ('mysticism', 'Mysticism', 'Explore the unknown with this enigmatic blend that connects you to ancient wisdom.', 'bg-purple-50', 'border-purple-500'),
  ('introspection', 'Introspection', 'Journey within yourself with this contemplative blend that promotes self-discovery.', 'bg-indigo-50', 'border-indigo-500');

-- Insert initial message templates
INSERT INTO message_templates (theme_id, message)
VALUES
  ('inspiration', 'The spark you''ve been seeking is already within you, waiting to be kindled.'),
  ('inspiration', 'Today, your creativity will flow like the steam rising from your cup.'),
  ('inspiration', 'Look to the patterns in your tea leaves – they mirror the patterns of opportunity in your life.'),
  ('serenity', 'Find peace in the space between breaths, just as flavor exists in the pause between sips.'),
  ('serenity', 'Like this tea, let warmth spread through you, melting away tension.'),
  ('serenity', 'The stillness in your cup reflects the calm you can cultivate within.'),
  ('adventure', 'The journey of a thousand miles begins with a single sip.'),
  ('adventure', 'New horizons await beyond the rim of your comfort zone.'),
  ('adventure', 'Like this tea''s journey from distant lands, your path will cross unexpected territories.');
