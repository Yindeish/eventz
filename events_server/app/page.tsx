
export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col gap--4 gap-3 p-25 pt-20 bg-gray-800">
      <div className="text-gray-500 text-4xl">Eventz API</div>

      <p className="text-gray-500 text-lg mt-2">
        AI-powered event platform for organizers, groups and individuals.
      </p>

      <div className="mt-6">
        <div className="text-gray-500 text-2xl">Download App</div>

        <a
          href="/downloads/eventz-app.apk"
          download
          className="inline-block mt-3 px-5 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Download Eventz Android App (.apk)
        </a>

        <p className="text-gray-500 text-sm mt-2">
          Android only • Enable “Install unknown apps” if prompted
        </p>
      </div>

      <div className="text-gray-500 text-2xl">Enpoints:</div>

      <ul className="list-disc">
        {[
          '/api/feeds/all',
          '/api/topics/all',
          '/api/trending/all',
          '/api/events/related-events/:event-id',
          '/api/events/following/:userId',
          '/api/posts/following/:userId',
          '/api/posts/improve-with-ai',
        ].map((endpoint, index) => (
          <li className="text-gray-500" key={index}>{endpoint}</li>
        ))}
      </ul>

      <div className="text-gray-500 text-2xl">Cron jobs:</div>

      <ul className="list-disc">
        {[
          '/api/feeds/generate',
          '/api/topics/generate',
          '/api/trending/generate',
          '/api/events/seed',
        ].map((endpoint, index) => (
          <li className="text-gray-500" key={index}>{endpoint}</li>
        ))}
      </ul>

    </div >
  );
}
