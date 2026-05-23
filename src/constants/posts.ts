// Action Notes 관련 상수
export const AUTHOR_STORAGE_KEY = 'action_notes_author';
// title 필드는 UI에서 노출하지 않고 content 앞부분으로 자동 생성 — 최대 길이
export const POST_TITLE_MAX_LENGTH = 40;
// posts.content는 DB TEXT이지만, 플로팅 패널 입력 UX를 위해 앱 레벨에서 제한한다.
export const ACTION_NOTE_CONTENT_MAX_LENGTH = 1000;
export const ACTION_NOTE_AUTHOR_MAX_LENGTH = 50;
