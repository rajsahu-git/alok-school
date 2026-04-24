import Directors_pen from '@/core/widgets/About/Directors-pen'
import PageHero from '@/core/widgets/shared/PageHero'
import React from 'react'

function page() {
  return (
    <div>
            <PageHero
        title="Director's Pen"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Director's Pen" },
        ]}
      />
      
      <Directors_pen />
    </div>
  )
}

export default page