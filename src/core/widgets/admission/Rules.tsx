"use client";

import { useState } from "react";
import PageHero from "@/core/widgets/shared/PageHero";

const TABS = ["General Rules", "Admission", "Registration", "Nursery", "Fee Rules", "Withdrawal"];

const RULES: Record<string, React.ReactNode> = {
  "General Rules": (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      <p>Failure to be present on the appointed date of admission test and interview will mean that the candidate forfeits his/her right to admission. The school reserves the right to admit or reject any student without assigning any reason. The decision of the Principal shall be abiding and final.</p>
      <p>Documents required at the time of admission:</p>
      <ul className="list-disc list-inside pl-4 flex flex-col gap-1 text-muted-foreground">
        <li>One recent passport size photograph.</li>
        <li>Countersigned T.C. of the previous school.</li>
        <li>Original progress Report/Mark sheet of the previous school.</li>
      </ul>
      <p>English is the medium of instruction.</p>
      <p>The enrolment form and the other necessary papers must be filled in with due care by parent/guardian. The name and date of birth of the student once recorded in the enrolment form and school admission register cannot be changed later. An undertaking to this effect will have to be signed with the enrolment form.</p>
      <p>Filling up of admission form, attending the Admission Test and personal interview do not guarantee admission in the School.</p>
      <p>Consistent attendance is a critical factor in academic success. Minimum 90% attendance is compulsory in all the classes, otherwise the defaulters will be detained from examination (subject to consideration).</p>
      <p>No late coming is allowed because Teachers highly value punctuality with their students by Planning, learning activities that encourage timely participation.</p>
      <p>The use of Cell phones / IPODs / Electronic Bluetooth Devices / Smart Watch or any expensive items are strictly prohibited within the school premises. If any student found with any type of electronic gadget it won't be returned and 500/-Rs. will be imposed on he/she. Emergency calls will be made at the reception phone lines.</p>
      <p>Admission is purely at the discretion of the School authorities.</p>
      <p>Violations of academic honesty will be treated with focused critical attention by the Administration and repeated offenses may lead to expulsion.</p>
      <p>School fees and other dues must be paid on time, If not penalties made be charged (subject to condition).</p>
      <p>School uniforms are to fit properly, not too tight and not too loose. School uniforms are to be worn in a proper prescribed manner. The school dress code is to install a sense of belongingness, uniformity and student’s identity for the Institution among all. The school recommends a set of regular uniforms for daily school and various days.</p>
      <p>Primarily, there is no provision for half day in the school. Students might leave early for special circumstances such as an unavoidable doctor’s appointment. In these special cases, parents must send a written note that clearly indicates the reason, and destination (subject to prior Information).</p>
      <p>Own transport is an option and is open to the students having authorised license. Those who are coming through motorbikes have to carry proper driving licence as per the norms of RTO. A Seperate parking area is allotted for students vehicle parking and the parking will be solely at the owners risk as it is free of charge.</p>
      <p>Every Wednesday has been fixed for parents meeting without any formal invitation. Kindly check and do confirm the time separately to school for meeting.</p>
      <p>Disciplinary issues of a relatively minor nature are almost always dealt with in the first instance by the classroom teacher/teacher on duty. There is very often a satisfactory resolution at this stage. Should an issue not be resolved it will move to the office. Repetition of the same or similar matters will result in an interview with the Principal a letter sent to parents and the school has a right to debar the student. In the case of misconduct and misbehaviour as a resolution to the issue further action by the school authority will be finally accepted.</p>
      <p>Submission of the fake documents will be treated as a fraud and is subject to legal action by the institution and student will be debarred.
School will not be responsible for any consequences occurred during the admission process in class XII and it is subject to condition as per CBSE norms.</p>
    <p>Area of jurisdiction will be Udaipur only.</p>
    </div>
  ),

  "Admission": (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      <li>The admissions start in the month of March except class XI & XII</li>
      <li>No student is admitted to the school without a written test.</li>
      <li>No admission will be considered until all the requirements are fully met. A Transfer Certificate (t.c.) from a recognized school will be required when admission is granted to class first and onwards.</li> 
      <li>Admission in the class X and XIl must be in accordance with a norms issued by CBSE.</li>
      <li>If pupil has come from a different state, the Transfer Certificate must be counter signed by the appropriate Education Officer concerned.</li>
      <li>Admission will be confirmed only on payment of all due fees. The fee is not refundable if a seat accepted, is later refused.</li>
      <li>The Principal does not bind himself to furnish any reason for rejecting admission.</li>
    </div>
  ),

  "Registration": (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      <p>Parents should fill in the application form for admission available from the school office on  payment of Rs. 200/- by cash, money order or crossed postal order in the name of the Principal, Alok Senior Secondary School, Rajsamand (Raj).</p>
      <p>The application form duly completed in all respect alongwith a non refundable registration fee of Rs. 200/- is to be submitted before or on an appointed date every year. The Office will acknowledge the receipt of the application and the Registration fee and then a registration number will be given.</p>

    </div>
  ),

  "Nursery": (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      <p>One month pre conditioning program has made free of charge in April/May. The school have a very attractive Nursery with a number of teaching aids, Play way equipments etc. A photo copy of the Birth Certificate must be attached to the application form.</p>
      <p>The minimum age required for Nursery is 3 years on  30th June of the year, in which admission is sought. Monthly fee is payable in four installments. The refreshment charges are for week days and picnic only.</p>
      
    </div>
  ),

  "Fee Rules": (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      <p>The fees mentioned in the chart is payable in advance before the 10th day of every month. Fees are chargeable for 12 months of the year. The fee once deposited is not refundable or transferable</p>
      <p>It is the responsibility of the parents/guardians to deposit all the fees in time otherwise school will be free to strike off the name from attendance register. The school will be free to fill the vacancy thus created.</p>
      <p>For the RE Admission the following payments will be necessary: – Dues of the previous month – Late fees – Re-admission fee of Rs. 250/-  Dues of the current month.</p>
    </div>
  ),

  "Withdrawal": (
    <div className="flex flex-col gap-3 text-sm text-foreground leading-relaxed">
      <p>A student may be withdrawn from the school only after giving a notice in writing before the 15 days of the preceding month.</p>
      <p>The Principal reserves the right to ask for the withdrawal of any student who has proved immune to correction.
Request for the withdrawal of a pupil must be made in wing by his/her parents accompanied by a remittance of requisite fees for the issue of the School Leaving Certificate.</p>
      <p>All the dues have to be cleared before a School leaving Certificate is issued. No question of refund of any dues of a child will arise at the time of withdrawal after getting admission into any class.</p>
      <p>The student shall be suspended or expelled from the school for a limited period or permanently on the following grounds.</p>
      <ul className="list-disc list-inside pl-4 flex flex-col gap-1 text-muted-foreground">
        <li>Indiscipline Gross indiscipline, Bad Company.</li>
        <li>Nonpayment of dues/fees.</li>
        <li>Unwillingness to adjust himself to the patter of school life.</li>
        <li>At any time, if the authorities are satisfied that such withdrawal is necessary in the interest of the school.</li>
        <li>The name of the student will be struck off the rolls after continuous absence for ten days without information. He/she may be readmitted as per rules and the discretion of the Principal.</li>
      </ul>
      
    </div>
  ),
};

export default function Rules() {
  const [activeTab, setActiveTab] = useState("General Rules");

  return (
    <>
      <PageHero
        title="Rules & Regulations"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admission", href: "/admission" },
          { label: "Rules & Regulations" },
        ]}
      />

      <section className="py-14 bg-background">
        <div className="container flex flex-col gap-8">

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary" style={{ fontFamily: "Georgia, serif" }}>
              General Rules &amp; Regulations
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="block w-12 h-px bg-accent" />
              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
              <span className="block w-12 h-px bg-accent" />
            </div>
          </div>

          {/* Tabs + Content */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden max-w-5xl mx-auto w-full">

            {/* Tab bar */}
            <div className="flex overflow-x-auto border-b border-border bg-secondary/30 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-5 py-3.5 text-xs font-bold uppercase tracking-wide transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-primary text-primary bg-card"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {RULES[activeTab]}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
