'use client';

import { useState, useEffect } from 'react';
import { members as staticMembers } from '@/data/members';
import MemberCard from './MemberCard';
import ScrollSection from './ScrollSection';

export default function MembersSection() {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch member count from Strava (profile pictures not available via API)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch('/api/strava', { signal: controller.signal })
      .then((response) => {
        clearTimeout(timeoutId);
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data?.club?.memberCount) {
          setMemberCount(data.club.memberCount);
        }
      })
      .catch(() => {
        // Silently fail - Strava not configured or timed out
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <ScrollSection className="members-section">
      {/* Header */}
      <div className="members-header">
        <h2 className="section-heading stagger-item">Our Runners</h2>
        <p className="section-subheading stagger-item">
          The Silk Stride family
          {memberCount && (
            <span className="member-count-badge"> · {memberCount} members</span>
          )}
        </p>
      </div>

      {/* Members grid */}
      <div className="members-grid">
        {staticMembers.map((member, index) => (
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
          {memberCount ? `View all ${memberCount} members` : 'More...'}
        </a>
      </div>
    </ScrollSection>
  );
}
