'use client';

import { Member } from '@/data/members';

interface MemberCardProps {
  member: Member;
  style?: React.CSSProperties;
}

export default function MemberCard({ member, style }: MemberCardProps) {
  return (
    <div className="member-card" style={style}>
      {/* Avatar placeholder */}
      <div className="member-avatar">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      {/* Name */}
      <h3 className="member-name">{member.name}</h3>
      
      {/* Role */}
      {member.role && (
        <p className="member-role">{member.role}</p>
      )}

      {/* Marathons participated */}
      <div className="member-marathons">
        <p className="member-marathons-label">Marathons</p>
        <div className="marathon-tags">
          {member.marathons.map((marathon) => (
            <span key={marathon} className="marathon-tag">
              {marathon}
            </span>
          ))}
        </div>
      </div>

      {/* Strava link */}
      <a
        href={member.stravaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="strava-link"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
        </svg>
        View on Strava
      </a>
    </div>
  );
}

