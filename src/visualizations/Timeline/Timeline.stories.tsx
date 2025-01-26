import React from 'react';
import { ResponsiveTimeline } from './Timeline';

export default {
  title: 'Visualizations/Timeline Modules'
};

const events = [
  { year: 1994, title: 'Birthday', detail: 'Beijing, China' },
  {
    year: 2007,
    title: 'High School',
    detail: 'Calgary, Alberta'
  },
  {
    year: 2013,
    title: 'McGill University',
    detail: 'Montreal, Quebec'
  },
  {
    year: 2015,
    title: 'Metanautix',
    detail: 'Palo Alto, California'
  },
  {
    year: 2018,
    title: 'Tableau',
    detail: 'Seattle, Washington'
  },
  {
    year: 2020,
    title: 'Airbnb',
    detail: 'Beijing, China'
  },
  {
    year: 2022,
    title: 'Presence',
    detail: 'Bay Area, California'
  }
];

export const TimelineStory = () => <ResponsiveTimeline events={events} />;

// Add a story with fewer events
export const ShortTimelineStory = () => (
  <ResponsiveTimeline
    events={[
      { year: 2020, title: 'Start', detail: 'Beginning' },
      { year: 2022, title: 'Middle', detail: 'Progress' },
      { year: 2024, title: 'End', detail: 'Completion' }
    ]}
  />
);
