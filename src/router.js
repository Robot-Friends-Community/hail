/**
 * Event routing for Hail.
 * Maps Claude Code hook events to CESP manifest categories.
 */

const state = require('./state');

/**
 * Route a hook event to a sound category.
 * @param {object} event - The parsed hook input JSON
 * @param {object} stateObj - Current state object (mutated for debounce/spam tracking)
 * @param {object} config - Current config
 * @returns {string|null} category name or null if no sound should play
 */
function route(event, stateObj, config) {
  const hookEvent = event.hook_event_name;
  if (!hookEvent) return null;

  const ntype = event.notification_type;

  switch (hookEvent) {
    case 'SessionStart':
      return 'session.start';

    case 'Stop': {
      if (state.checkStopDebounce(stateObj, 5)) return null;
      return 'task.complete';
    }

    case 'Notification': {
      if (ntype === 'permission_prompt') return null;
      if (ntype === 'idle_prompt') return null;
      return 'task.complete';
    }

    case 'PermissionRequest':
      return 'input.required';

    case 'UserPromptSubmit': {
      const threshold = config.annoyed_threshold || 3;
      const window = config.annoyed_window_seconds || 10;
      const sessionId = event.session_id || event.conversation_id || 'default';
      const count = state.trackPrompt(stateObj, sessionId, window);
      if (count >= threshold) return 'user.spam';
      return null;
    }

    case 'PostToolUseFailure':
      return 'task.error';

    case 'SubagentStart':
      return 'task.acknowledge';

    default:
      return null;
  }
}

module.exports = { route };
