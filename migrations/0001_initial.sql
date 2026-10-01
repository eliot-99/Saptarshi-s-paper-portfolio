CREATE TABLE IF NOT EXISTS portfolio_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  document TEXT NOT NULL CHECK (json_valid(document)),
  version INTEGER NOT NULL CHECK (version >= 1),
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_history (
  version INTEGER PRIMARY KEY,
  document TEXT NOT NULL CHECK (json_valid(document)),
  saved_at TEXT NOT NULL
);

CREATE TRIGGER IF NOT EXISTS portfolio_content_created
AFTER INSERT ON portfolio_content
BEGIN
  INSERT INTO content_history (version, document, saved_at)
  VALUES (NEW.version, NEW.document, NEW.updated_at);
END;

CREATE TRIGGER IF NOT EXISTS portfolio_content_updated
AFTER UPDATE ON portfolio_content
BEGIN
  INSERT INTO content_history (version, document, saved_at)
  VALUES (NEW.version, NEW.document, NEW.updated_at);
  DELETE FROM content_history WHERE version NOT IN (
    SELECT version FROM content_history ORDER BY version DESC LIMIT 30
  );
END;

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  credential_version TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry ON admin_sessions (expires_at);

CREATE TABLE IF NOT EXISTS login_attempts (
  scope TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS login_attempts_window ON login_attempts (window_start);

CREATE TABLE IF NOT EXISTS media_library (
  key TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS media_library_upload_date ON media_library (uploaded_at DESC, key);

