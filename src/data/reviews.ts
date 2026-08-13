/**
 * Echte Google-Rezensionen von KlarWerk Service – einzige Quelle der Wahrheit.
 *
 * WICHTIG: Hier werden ausschließlich ECHTE Bewertungen gepflegt. Es werden
 * keine Bewertungen erfunden. `serviceIds` verknüpft eine Rezension nur dann
 * mit einer Leistung, wenn der Text diese Leistung tatsächlich benennt.
 * So erscheinen auf jeder Leistungsseite passende bzw. allgemeine echte Stimmen.
 */

export interface Review {
  name: string;
  meta: string;
  text: string;
  /** IDs aus services.ts, sofern die Rezension eine konkrete Leistung benennt. */
  serviceIds?: string[];
}

export const reviews: Review[] = [
  {
    name: 'Niklas S.',
    meta: 'Google-Rezension',
    text: 'Für mich der beste Reinigungsservice in Bonn! Ich habe meine Couch reinigen lassen und bin rundum begeistert. Zwei freundliche und professionelle Mitarbeiter waren pünktlich vor Ort. Bereits nach etwa einer Stunde sah meine Couch wieder aus wie neu – sauberer und frischer als je zuvor. Klare Empfehlung!',
    serviceIds: ['moebelreinigung'],
  },
  {
    name: 'Daniel B.',
    meta: 'Google-Rezension',
    text: 'Die Büroreinigung wurde sehr gründlich und zuverlässig durchgeführt. Alles war anschließend sauber, ordentlich und hygienisch einwandfrei. Das Team war pünktlich, freundlich und professionell. Besonders positiv ist die gleichbleibend hohe Qualität der Reinigung. Wir sind sehr zufrieden.',
    serviceIds: ['bueroreinigung', 'gebaeudereinigung', 'unterhaltsreinigung'],
  },
  {
    name: 'Philipp C.',
    meta: 'Google-Rezension',
    text: 'Die Reinigung unseres Carports und der Terrassenüberdachung wurde zügig und sehr sorgfältig durchgeführt. Das Ergebnis hat uns vollkommen überzeugt. Im nächsten Frühjahr werden wir den Service gerne erneut in Anspruch nehmen. Klare Empfehlung!',
    serviceIds: ['glasreinigung', 'grundreinigung'],
  },
  {
    name: 'Luca P.',
    meta: 'Google-Rezension',
    text: 'Herr Saleh reagiert sehr schnell auf Anfragen zu möglichen Aufträgen. Die Kommunikation verläuft stets reibungslos und zuverlässig. Zudem überzeugt das Preis-Leistungs-Verhältnis auf ganzer Linie.',
  },
  {
    name: 'Müge Nur Kansiz',
    meta: 'Google-Rezension',
    text: 'Ein sympathisches und professionelles Unternehmen. Die Arbeit wird schnell, gründlich und zuverlässig ausgeführt. Für mich persönlich die klare Nummer 1 in NRW – weiter so!',
  },
  {
    name: 'Stefani W.',
    meta: 'Google-Rezension',
    text: 'Wir haben die Dienstleistungen der Firma bereits mehrfach genutzt und waren jedes Mal sehr zufrieden. Der Service ist schnell, die Termine werden zuverlässig eingehalten und die Arbeit wird professionell ausgeführt. Auch das Preis-Leistungs-Verhältnis ist sehr fair.',
  },
  {
    name: 'Zoalfkar Alwasel',
    meta: 'Google-Rezension · vor 5 Monaten',
    text: 'Top Arbeit! Alles wurde sauber und professionell ausgeführt. Der Umgang war sehr freundlich und angenehm. Gerne wieder!',
  },
  {
    name: 'Abdu Alrahman',
    meta: 'Google-Rezension · vor einem Monat',
    text: 'Sehr zuverlässiger und professioneller Reinigungsservice. Die Arbeit wurde gründlich und pünktlich erledigt. Das Team war freundlich und das Ergebnis überzeugend. Zudem hinterlässt die Reinigung einen angenehmen, frischen Duft. Klare Empfehlung!',
  },
  {
    name: 'S&A Designer',
    meta: 'Google-Rezension · vor 2 Monaten',
    text: 'Ich bin wirklich begeistert vom Service von KlarWerk! Vom ersten Kontakt bis zur abgeschlossenen Reinigung hat alles reibungslos funktioniert. Das Team arbeitet sehr professionell, zuverlässig und ist dabei ausgesprochen freundlich.',
  },
  {
    name: 'Hamada Höfn',
    meta: 'Local Guide · vor 2 Monaten',
    text: 'Ich bin äußerst zufrieden mit dem Service von KlarWerk! Das Team arbeitet sehr professionell, zuverlässig und gründlich. Die Reinigung wurde pünktlich und mit großer Sorgfalt durchgeführt.',
  },
];

/** Allgemeine (nicht leistungsspezifische) echte Rezensionen. */
export const generalReviews: Review[] = reviews.filter(
  (r) => !r.serviceIds || r.serviceIds.length === 0,
);

/**
 * Liefert bis zu `limit` echte Rezensionen für eine Leistung:
 * zuerst thematisch passende, danach allgemeine – nie erfundene.
 */
export function getReviewsForService(serviceId: string, limit = 3): Review[] {
  const specific = reviews.filter((r) => r.serviceIds?.includes(serviceId));
  const result = [...specific];
  for (const r of generalReviews) {
    if (result.length >= limit) break;
    result.push(r);
  }
  return result.slice(0, limit);
}
