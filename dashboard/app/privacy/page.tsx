export const metadata = {
  title: 'Privacyverklaring | PromptGuard',
  description:
    'Privacyverklaring van PromptGuard — hoe wij omgaan met uw gegevens conform de AVG.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            PromptGuard
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Privacyverklaring
          </h1>
          <p className="mt-4 text-gray-500">
            Laatste update: 17 mei 2026
          </p>
        </div>

        <div className="prose prose-gray max-w-none space-y-10">

          {/* 1. Wie zijn wij */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              1. Wie zijn wij?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              PromptGuard is een product van PromptGuard B.V., gevestigd in Nederland.
              Wij bieden een browserextensie en een bijbehorend dashboard waarmee
              organisaties kunnen monitoren welke categorieën gevoelige informatie
              medewerkers invoeren in publieke AI-tools zoals ChatGPT, Claude, Gemini
              en Copilot.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Contactgegevens:{' '}
              <a
                href="mailto:info@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                info@promptguard.nl
              </a>
            </p>
          </section>

          {/* 2. Welke data verzamelen wij */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              2. Welke gegevens verwerken wij?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De PromptGuard extensie detecteert <strong>uitsluitend metadata</strong> over
              gedetecteerde risico&apos;s. De extensie verwerkt <strong>nooit</strong> de
              daadwerkelijke inhoud van prompts of andere tekst die de gebruiker invoert.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Wij verzamelen:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Detectiemetadata:</strong> welke categorie gevoelige data is
                gedetecteerd (bijv. &ldquo;BSN&rdquo;, &ldquo;IBAN&rdquo;, &ldquo;e-mailadres&rdquo;), het
                aantal gevonden items, en de ernstclassificatie (laag / gemiddeld / hoog).
              </li>
              <li>
                <strong>Tool-naam:</strong> op welke AI-tool de detectie plaatsvond
                (bijv. &ldquo;ChatGPT&rdquo;).
              </li>
              <li>
                <strong>Tijdstempel:</strong> het moment van detectie (ISO 8601).
              </li>
              <li>
                <strong>Anonieme installatie-ID:</strong> een gehashte, willekeurig
                gegenereerde identifier die per installatie uniek is. Er zijn geen
                persoonsgegevens aan gekoppeld.
              </li>
              <li>
                <strong>Team-tag:</strong> een optioneel label dat door de IT-beheerder
                via managed policy kan worden ingesteld.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
              <strong>Belangrijk:</strong> PromptGuard leest, bewaart of verstuurt
              de inhoud van promptteksten, wachtwoorden, documenten of andere
              persoonlijke invoer <em>nooit</em>.
            </p>
          </section>

          {/* 3. Hoe gebruiken wij deze data */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              3. Waarvoor gebruiken wij deze gegevens?
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De verzamelde metadata wordt uitsluitend gebruikt voor:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li>
                Het samenstellen van geaggregeerde statistieken in het PromptGuard
                dashboard, zichtbaar voor de IT-beheerder van uw organisatie.
              </li>
              <li>
                Het genereren van real-time waarschuwingen wanneer medewerkers
                gevoelige data invoeren in een AI-tool.
              </li>
              <li>
                Het verbeteren van de detectielogica (anoniem, geen terugkoppeling
                naar individuele gebruikers).
              </li>
            </ul>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De gegevens worden <strong>niet</strong> gebruikt voor profilering,
              gerichte advertenties of enig ander doel dan het verlenen van de dienst.
            </p>
          </section>

          {/* 4. Geen verkoop */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              4. Wij verkopen geen gegevens
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              PromptGuard verkoopt, verhuurt of deelt uw gegevens <strong>nooit</strong> met
              derden voor commerciële doeleinden. Gegevens worden niet doorgegeven aan
              advertentienetwerken, datamakelaars of andere externe partijen die de
              gegevens voor eigen doeleinden zouden gebruiken.
            </p>
          </section>

          {/* 5. Opslag en beveiliging */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              5. Opslag en beveiliging
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Detectiegebeurtenissen worden tijdelijk lokaal opgeslagen in de
              browser (via <code className="bg-gray-100 px-1 rounded">chrome.storage.local</code>)
              en vervolgens in batches via HTTPS verzonden naar de door uw
              organisatie geconfigureerde dashboard-URL. Alle communicatie verloopt
              versleuteld. API-sleutels worden alleen lokaal opgeslagen en zijn nooit
              zichtbaar in de broncode.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Data wordt bewaard zolang uw organisatie gebruik maakt van de dienst.
              Lokale data in de browser wordt gewist zodra de extensie wordt
              verwijderd.
            </p>
          </section>

          {/* 6. Rechtsgrond */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              6. Rechtsgrond (AVG)
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De verwerking is gebaseerd op het <strong>gerechtvaardigd belang</strong> van
              de organisatie (artikel 6 lid 1 sub f AVG) om gevoelige bedrijfsdata te
              beschermen, of — indien van toepassing — op de <strong>overeenkomst</strong>
              met de organisatie die PromptGuard heeft afgenomen. Voor zover de
              installatie-ID als persoonsgegeven kwalificeert, is de verwerking
              geanonimiseerd door middel van SHA-256 hashing.
            </p>
          </section>

          {/* 7. Uw rechten */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              7. Uw rechten onder de AVG
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Als betrokkene heeft u de volgende rechten:
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Recht op inzage:</strong> u kunt opvragen welke gegevens over
                u zijn opgeslagen.
              </li>
              <li>
                <strong>Recht op rectificatie:</strong> onjuiste gegevens kunnen worden
                gecorrigeerd.
              </li>
              <li>
                <strong>Recht op verwijdering (&ldquo;recht op vergetelheid&rdquo;):</strong> u
                kunt verzoeken uw gegevens te verwijderen.
              </li>
              <li>
                <strong>Recht op beperking:</strong> u kunt de verwerking laten
                beperken in bepaalde omstandigheden.
              </li>
              <li>
                <strong>Recht van bezwaar:</strong> u kunt bezwaar maken tegen
                verwerking op basis van gerechtvaardigd belang.
              </li>
              <li>
                <strong>Recht op dataportabiliteit:</strong> u kunt uw gegevens in een
                machine-leesbaar formaat opvragen.
              </li>
            </ul>
            <p className="mt-4 text-gray-600 leading-relaxed">
              U kunt uw rechten uitoefenen door een e-mail te sturen naar{' '}
              <a
                href="mailto:info@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                info@promptguard.nl
              </a>
              . Wij reageren binnen 30 dagen. U heeft ook het recht een klacht in te
              dienen bij de{' '}
              <a
                href="https://www.autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                Autoriteit Persoonsgegevens
              </a>
              .
            </p>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              8. Cookies en tracking
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              De browserextensie gebruikt <strong>geen cookies</strong> en voert
              <strong> geen cross-site tracking</strong> uit. Het dashboard kan
              functionele cookies gebruiken voor authenticatie (sessie-cookies).
              Er worden geen tracking- of analysecookies van derden geplaatst.
            </p>
          </section>

          {/* 9. Wijzigingen */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              9. Wijzigingen in deze verklaring
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Wij kunnen deze privacyverklaring van tijd tot tijd bijwerken. Bij
              materiële wijzigingen informeren wij gebruikers via het dashboard of via
              e-mail. De datum van de laatste update staat bovenaan deze pagina
              vermeld.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              10. Contact
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Heeft u vragen over deze privacyverklaring of over de verwerking van
              uw gegevens? Neem contact op via:
            </p>
            <address className="mt-3 not-italic text-gray-600 leading-relaxed">
              PromptGuard B.V.<br />
              Nederland<br />
              <a
                href="mailto:info@promptguard.nl"
                className="text-indigo-600 underline hover:text-indigo-800"
              >
                info@promptguard.nl
              </a>
            </address>
          </section>
        </div>
      </div>
    </main>
  );
}
