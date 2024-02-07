// app/GoogleAnalytics.jsx

'use client'

import Script from 'next/script'

const GoogleAnalytics = ({ trackingId }: { trackingId: string | undefined }) => {
  if (!trackingId) {
    throw new Error('Google Analytics tracking ID is required')
  }

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${trackingId}', {
                      page_path: window.location.pathname,
                      });
                    `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics
