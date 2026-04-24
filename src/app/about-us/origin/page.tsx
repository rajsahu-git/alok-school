import Origin from '@/core/widgets/About/Origin'
import PageHero from '@/core/widgets/shared/PageHero'
import React from 'react'

function History() {
  return (
    <div>
            <PageHero
        title="Our History"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our History" },
        ]}
      />
      
      <Origin />
    </div>
  )
}

export default History