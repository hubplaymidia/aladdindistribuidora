'use client'

import * as React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

// Premium standardized line-style brand icons.
// All use currentColor so they inherit text color.

export function InstagramIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.83c0 4.54-3.7 8.24-8.25 8.24-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24Zm-2.6 4.43c-.16-.36-.32-.37-.47-.38h-.4c-.14 0-.36.05-.55.26-.19.21-.72.71-.72 1.72 0 1.01.74 1.99.84 2.13.1.14 1.43 2.28 3.55 3.1 1.76.68 2.12.55 2.5.51.38-.04 1.23-.5 1.4-.99.17-.49.17-.9.12-.99-.05-.09-.19-.14-.4-.25-.21-.1-1.23-.61-1.42-.68-.19-.07-.33-.1-.47.11-.14.21-.54.68-.66.82-.12.14-.24.16-.45.05-.21-.1-.88-.32-1.68-1.03-.62-.55-1.04-1.24-1.16-1.45-.12-.21-.01-.32.09-.43.09-.09.21-.24.31-.36.1-.12.14-.21.21-.35.07-.14.03-.26-.02-.36-.05-.1-.46-1.12-.63-1.53Z" />
    </svg>
  )
}

export function WazeIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C6.5 2 2 5.8 2 10.5c0 2.8 1.6 5.3 4.2 6.9-.1.9-.5 2.2-1.4 3.3-.2.3 0 .7.4.6 1.7-.3 3.2-1 4.3-1.7.8.2 1.6.3 2.5.3 5.5 0 10-3.8 10-8.5S17.5 2 12 2Zm0 14.5c-3.6 0-6.5-2.4-6.5-5.3 0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 2.2 2.3 4 5.1 4 2 0 3.6-1 3.6-2.4 0-1.2-1.1-1.7-3-2.2l-1.2-.3c-1.3-.3-2-.7-2-1.5 0-1 1.2-1.6 2.7-1.6 1.4 0 2.4.5 2.6 1.4.1.3.4.6.7.5.4-.1.6-.4.5-.8-.3-1.3-1.6-2.1-3.8-2.1-2.3 0-4.1 1.1-4.1 2.6 0 1.3.9 2 2.8 2.4l1.2.3c1.8.4 2.2.8 2.2 1.5 0 1.1-1.3 1.9-3.4 1.9Zm3.2-2.1c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9Z" />
    </svg>
  )
}

export function YouTubeIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21.6 7.2c-.2-1-.9-1.8-1.9-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.7.4c-1 .2-1.7 1-1.9 2C2 9 2 12 2 12s0 3 .4 4.8c.2 1 .9 1.8 1.9 2 1.8.4 7.7.4 7.7.4s5.9 0 7.7-.4c1-.2 1.7-1 1.9-2 .4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  )
}

export function GoogleMapsIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}
