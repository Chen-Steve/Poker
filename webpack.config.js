const path = require('path');

module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@supabase/supabase-js': path.resolve(__dirname, 'node_modules/@supabase/supabase-js'),
      '@supabase/auth-js': path.resolve(__dirname, 'node_modules/@supabase/auth-js'),
    },
  },
  // ...
};