'use client';

import { members } from '@/data/members';
import MemberCard from './MemberCard';
import ScrollSection from './ScrollSection';

const MEMBER_COUNT = 32;

export default function MembersSection() {
  return (
    <ScrollSection className="members-section">
      {/* Header */}
      <div className="members-header">
        <h2 className="section-heading stagger-item">Our Runners</h2>
        <p className="section-subheading stagger-item">
          The Silk Stride family
          <span className="member-count-badge"> · {MEMBER_COUNT} members</span>
        </p>
      </div>

      {/* Members grid */}
      <div className="members-grid">
        {members.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            style={{ animationDelay: `${0.1 + index * 0.1}s` }}
          />
        ))}
      </div>

      <div className="members-more">
        <a
          className="members-more-btn"
          href="https://www.strava.com/clubs/silkstride/members"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all {MEMBER_COUNT} members
        </a>
      </div>
    </ScrollSection>
  );
}
