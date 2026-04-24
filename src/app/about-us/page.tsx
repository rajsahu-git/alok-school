import AboutList from '@/core/widgets/About/AboutList'
import Origin from '@/core/widgets/About/Origin'
import PageHero from '@/core/widgets/shared/PageHero'
import React from 'react'

function page() {
  return (
    <div>
      <PageHero
        title="Our History"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our History" },
        ]}
      />
      <AboutList />
      <Origin />
    </div>
  )
}

export default page