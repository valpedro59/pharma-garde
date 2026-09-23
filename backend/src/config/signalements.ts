/**
 * Seuil et fenêtre temporelle du badge "Signalée fermée récemment" (US5, CA1).
 * Un signalement isolé, ou trop ancien, ne déclenche pas le badge.
 */

/** Nombre de signalements récents à partir duquel le badge apparaît. */
export const SEUIL_SIGNALEMENTS = 3;

/** Un signalement plus vieux que cette fenêtre (en heures) ne compte plus. */
export const FENETRE_SIGNALEMENTS_HEURES = 3;

export const calculerSeuilTemporel = (): Date =>
  new Date(Date.now() - FENETRE_SIGNALEMENTS_HEURES * 60 * 60 * 1000);
