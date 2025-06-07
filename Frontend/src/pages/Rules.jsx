import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpenIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    SparklesIcon,
    CalculatorIcon,
    ChartBarIcon,
    QuestionMarkCircleIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../App';

const Section = ({ title, icon, items, isDarkMode }) => {
    const [expandedItems, setExpandedItems] = useState({});

    const toggleItem = (index) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`section-card mb-8 p-4 rounded-xl shadow-lg ${isDarkMode ? "bg-black" : "bg-white"
                }`}
        >
            <div className="icon-wrapper mb-4 bg-blue-100">{icon}</div>
            <h2 className="text-2xl font-bold mb-6 text-black">{title}</h2>
            <ul className="space-y-4">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`pb-4 ${isDarkMode ? "border-b border-black" : "border-b border-gray-100"
                            }`}
                    >
                        <div className="flex items-start cursor-pointer" onClick={() => toggleItem(index)}>
                            <span className="mr-2">•</span>
                            <div className="flex-1">
                                <p className={`${isDarkMode ? "font-medium text-gray-700" : "font-medium text-gray-800"}`}>
                                    {item.title}
                                </p>
                                <motion.div initial={false} animate={{ height: expandedItems[index] ? 'auto' : 0 }} className="overflow-hidden">
                                    {expandedItems[index] && (
                                        <div className={`mt-2 ${isDarkMode ? "text-black" : "text-gray-600"}`}>
                                            {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
                                            {
                                                item.link && (
                                                    <div className='mt-2 text-blue-700'>
                                                        <a 
                                                     href={item?.link}>Read More</a>
                                                    </div>
                                                     
                                                )
                                            }
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                            <ChevronDownIcon
                                className={`w-5 h-5 transform transition-transform ${expandedItems[index] ? 'rotate-180' : ''}`}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

const Rules = () => {
    const { isDarkMode } = useTheme();

    const guidelines = [
        {
            title: "Code of Conduct",
            content:
                "Members should respect each other, be honest about their achievements, and follow legal and platform guidelines to maintain a trustworthy, inclusive environment. Our community values respectful and inclusive behavior, honest representation of achievements, and strict adherence to ethical, legal, and platform-specific guidelines."
        },
        {
            title: "Content Standards",
            content:
                "Our platform maintains a high standard for content by requiring that all shared materials are accurate, respectful, and constructive. Users must ensure their contributions are clear, well-articulated, and free from offensive language or personal attacks, while respecting intellectual property rights. This standard supports a professional and inclusive environment that fosters meaningful discussions and reliable information for all community members."
        },
        {
            title: "Communication Guidelines",
            content:
                "Practice clear, constructive communication. Be patient with newcomers, provide helpful feedback, and maintain a positive atmosphere in all interactions."
        },
        {
            title: "Privacy & Data Security",
            content:
                "Respect the privacy of your own and others' personal data. Handle all information securely and adhere to data protection laws, ensuring sensitive details are safeguarded at all times."
        },
        {
            title: "Quality Contributions",
            content:
                "Ensure that your posts and shared data are original, well-researched, and useful to the community. Strive for clarity and accuracy, and avoid duplicating or plagiarizing content."
        },
        {
            title: "Collaboration & Mentorship",
            content:
                "Encourage a collaborative learning environment by sharing insights, supporting peers, and mentoring newcomers. Constructive engagement helps strengthen our community."
        },
        {
            title: "Feedback & Dispute Resolution",
            content:
                "Provide respectful, constructive feedback and resolve conflicts amicably. Utilize our formal reporting channels if issues arise, and always approach disagreements with a solution-oriented mindset."
        },
        {
            title: "User Responsibility",
            content:
                "Users are responsible for maintaining the security of their accounts and ensuring the accuracy of their profile data. Keep your credentials safe and update your information as needed."
        }
    ];


    const rules = [
        {
            title: "Account Security",
            content:
                "Maintain strong passwords, enables strong authentication, and never share your credentials. Regular security audits are recommended."
        },
        {
            title: "Content Ownership",
            content:
                "Users retain ownership of their original content while granting us license to display and distribute it. Respect intellectual property rights and copyright laws."
        },
        {
            title: "Reporting Violations",
            content:
                "Report any violations promptly through appropriate channels. Include relevant details and evidence when submitting reports."
        },
        {
            title: "Data Integration Accuracy",
            content:
                "Ensure that all aggregated data from LeetCode, GeeksforGeeks, GitHub, Codeforces, and CodeChef is accurate and up-to-date. Users should be able to verify and flag discrepancies so that recruiters and interviewers receive reliable information for candidate assessments."
        },
        {
            title: "User Privacy & Consent",
            content:
                "All data collected from third-party platforms must be accessed with explicit user consent. We strictly adhere to privacy laws and regulations, ensuring that personal information is stored securely and used only for candidate evaluation purposes."
        },
        {
            title: "Compliance with Third-Party Terms",
            content:
                "Our platform integrates data from multiple sources, and it is imperative to comply with the terms of service and usage guidelines of each provider. Unauthorized data extraction or misuse of data from LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub is strictly prohibited."
        },
        {
            title: "Quality Assurance and Verification",
            content:
                "Implement robust processes to verify the accuracy and integrity of displayed data. Regular audits, user feedback, and automated checks should be conducted to ensure that the platform remains a trustworthy resource for both recruiters and interviewers."
        },
        {
            title: "Responsible Data Usage",
            content:
                "Data on this platform is provided solely for candidate assessment and evaluation. Recruiters and interviewers must use the information ethically and responsibly, avoiding any practices that could lead to discrimination or misuse."
        },
        {
            title: "Continuous Data Synchronization",
            content:
                "Maintain real-time or scheduled synchronization of profiles and ratings from all integrated platforms. This ensures that the latest performance metrics and updates are always available for accurate candidate assessment."
        },
        {
            title: "Feedback and Continuous Improvement",
            content:
                "We welcome constructive feedback on data accuracy, user experience, and overall platform performance. Continuous improvements will be made based on user input, ensuring the platform remains reliable, effective, and user-friendly."
        },
        {
            title: "Account Verification Challenge",
            content:
                "To verify account ownership, users will be presented with a challenge that includes a deliberately introduced compile error. Correcting this error confirms the user's control over the account and enhances overall security."
        }
    ];


    const privacy = [
        {
            title: "Data Collection",
            content:
                "We collect necessary information to provide our services, including usage data, device information, and user-provided content. All data collection complies with relevant privacy laws."
        },
        {
            title: "Data Protection",
            content:
                "Your data is encrypted and stored securely. We implement industry-standard security measures and regularly update our protection protocols."
        },
        {
            title: "User Rights",
            content:
                "You have the right to access, modify, or delete your personal data. Contact our privacy team for any data-related requests or concerns."
        },
        {
            title: "Data Sharing",
            content:
                "We do not share your personal data with third parties except as necessary to provide our services or as required by law. Any data sharing with partners is governed by strict confidentiality agreements."
        },
        {
            title: "Cookies and Tracking",
            content:
                "We use cookies and similar tracking technologies to enhance your user experience, analyze site traffic, and deliver personalized content. You can manage your cookie preferences through your browser settings."
        },
        {
            title: "Third-Party Services",
            content:
                "Our platform may integrate with third-party services to offer additional features. We ensure that these partners adhere to comparable privacy standards, though we are not responsible for their practices."
        },
        {
            title: "Data Retention",
            content:
                "We retain personal data only as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by law."
        },
        {
            title: "Consent and Policy Updates",
            content:
                "By using our services, you consent to our data practices as described in this policy. We may update this policy from time to time, and any changes will be communicated clearly."
        }
    ];


    const benefits = [
        {
            title: "Enhanced Productivity",
            content:
                "Our platform streamlines workflows, automates repetitive tasks, and provides intuitive tools that boost productivity by up to 40%."
        },
        {
            title: "Cost Efficiency",
            content:
                "Reduce operational costs by leveraging our cloud-based infrastructure, eliminating the need for expensive hardware and maintenance."
        },
        {
            title: "Scalability",
            content:
                "Our architecture easily scales with your needs, supporting growth from startups to enterprise-level operations without service disruption."
        },
        {
            title: "24/7 Support",
            content:
                "Access round-the-clock technical support, comprehensive documentation, and a vibrant community of developers."
        },
        {
            title: "Centralized Candidate Insights",
            content:
                "Aggregate profiles and performance data from LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub into one unified dashboard, simplifying candidate evaluation."
        },
        {
            title: "Data-Driven Recruitment",
            content:
                "Leverage normalized ratings and advanced analytics to make informed hiring decisions, ensuring objective and transparent candidate assessments."
        },
        {
            title: "Comprehensive Skill Assessment",
            content:
                "Evaluate candidates across multiple coding disciplines with a holistic view of their problem-solving skills, coding proficiency, and project contributions."
        },
        {
            title: "Time Efficiency",
            content:
                "Save time by accessing all relevant candidate data in a single platform, eliminating the need to cross-reference multiple sites and tools."
        },
        {
            title: "Enhanced Transparency",
            content:
                "Provide recruiters and interviewers with clear, verified performance metrics that foster unbiased evaluations and informed decision-making."
        },
        {
            title: "Integrated Account Verification",
            content:
                "Ensure authenticity by challenging users with a compile-error correction task, which verifies account ownership and enhances overall security."
        }
    ];


    const features = [
        {
            title: "Real-time Collaboration",
            content:
                "Work simultaneously with team members, track changes in real-time, and maintain version control across all projects."
        },
        {
            title: "Advanced Analytics",
            content:
                "Gain insights through detailed analytics, custom reports, and interactive dashboards that visualize your data."
        },
        {
            title: "API Integration",
            content:
                "Seamlessly integrate with popular tools and services through our comprehensive API and pre-built connectors."
        },
        {
            title: "Custom Workflows",
            content:
                "Create and automate custom workflows tailored to your specific business processes and requirements."
        },
        {
            title: "Aggregated Coding Profiles",
            content:
                "Extract and consolidate data from LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub, including ratings, contest performance, problem-solving history, and code contributions."
        },
        {
            title: "Unified Candidate Dashboard",
            content:
                "Access a single dashboard that displays comprehensive candidate profiles, performance metrics, and historical trends across multiple coding platforms."
        },
        {
            title: "Customizable Data Filters",
            content:
                "Filter and sort candidate data by ratings, contest results, contributions, and coding proficiency to match specific recruitment criteria."
        },
        {
            title: "Performance Trends & Benchmarking",
            content:
                "Track candidates' progress over time and benchmark their performance against industry standards and peer groups."
        },
        {
            title: "Account Verification Challenge",
            content:
                "Verify account ownership with a unique compile error challenge, ensuring data authenticity and enhanced security."
        },
        {
            title: "Secure Real-Time Synchronization",
            content:
                "Ensure candidate data is continuously updated and synchronized in real-time for accurate, up-to-date assessments."
        },
        {
            title: "Advanced Search & Filtering",
            content:
                "Utilize powerful search capabilities to quickly locate candidates based on specific metrics, skills, or performance indicators."
        },
        {
            title: "Data Insights & Reporting",
            content:
                "Generate in-depth reports and actionable insights, enabling recruiters to make data-driven decisions based on comprehensive candidate evaluations."
        },
        {
            title: "User-Friendly Interface",
            content:
                "Navigate through an intuitive interface designed to simplify the process of evaluating and comparing candidate data across multiple platforms."
        },
        {
            title: "LeetCode Data",
            content:
                "Extracted Data: User rating, total problems solved, contest rankings, submission history, and difficulty breakdown. Unified Dashboard: Displays coding proficiency, contest performance trends, problem-solving statistics, and progress over time."
        },
        {
            title: "CodeChef Data",
            content:
                "Extracted Data: Overall rating, contest participation records, problem-solving milestones, and historical performance data. Unified Dashboard: Showcases contest rankings, achievement badges, problem-solving trends, and performance insights."
        },
        {
            title: "Codeforces Data",
            content:
                "Extracted Data: Current rating, contest results, participation history, and dynamic rating graphs. Unified Dashboard: Provides visual analytics of rating progression, contest performance summaries, and comparative metrics among peers."
        },
        {
            title: "GeeksforGeeks Data",
            content:
                "Extracted Data: Engagement metrics, practice problem completions. Unified Dashboard: Highlights learning progress, topic expertise, and overall activity levels, along with specific areas of strength."
        },
        {
            title: "GitHub Data",
            content:
                "Extracted Data: Repository contributions, starred repos, active days and collaborative projects. Unified Dashboard: Displays code activity, project impact, and collaboration metrics."
        },
        {
            title: "Unified Dashboard",
            content: "Our unified dashboard consolidates key metrics from all integrated platforms—LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub — into a single view. It displays comprehensive performance data including total problem solved ..(LeetCode, CodeForces & GeeksforGeeks), avg contest ratings ..(LeetCode, CodeForces, CodeChef & GeeksforGeeks), active days ..(LeetCode, CodeForces, CodeChef, GeeksforGeeks & GitHub), total submissions ..(LeetCode, CodeForce & CodeChef), total contributions ..(GitHub), contest rating graphs ..(LeetCode, CodeForces & CodeChef), combined submission or contribution calender ..(LeetCode, CodeForces, CodeChef & GitHub). This interactive dashboard provides recruiters with actionable insights and allows users to monitor their progress and identify areas for improvement."
        }
    ];


    const calculations = [
        {
            title: "Total Active Days",
            content: (
                <div className="space-y-2">
                    <p>
                        <strong>Total Active Days</strong> represents the number of unique dates on which any activity (submissions or contributions) was recorded.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">Example:</p>
                        <p>If activities were recorded on 25 distinct days, then Total Active Days = 25.</p>
                    </div>
                </div>
            )
        },
        {
            title: "Total Submissions & Contributions",
            content: (
                <div className="space-y-2">
                    <p>
                        <strong>Total Submissions</strong> is the sum of all submissions from various platforms, and <strong>Total Contributions</strong> is the sum of contributions (like commits or code reviews).
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">Example:</p>
                        <p>Total Submissions = 150, Total Contributions = 50, so Total Activity Count = 150 + 50 = 200.</p>
                    </div>
                </div>
            )
        },
        {
            title: "Average Contest Rating",
            content: (
                <div className="space-y-2">
                    <p>
                        The <strong>Average Contest Rating</strong> is derived by averaging the latest contest ratings from platforms such as Codeforces, CodeChef, LeetCode, and GeeksforGeeks.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">Example:</p>
                        <p>Ratings: [1500, 1600, 1400, 1550] then Average Contest Rating = (1500 + 1600 + 1400 + 1550) / 4 = 1512.5</p>
                    </div>
                </div>
            )
        },
        {
            title: "Total Problems Solved",
            content: (
                <div className="space-y-2">
                    <p>
                        This metric aggregates the total number of problems solved across all integrated platforms.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">Example:</p>
                        <p>If CodeForces = 150, LeetCode = 200, and GeeksforGeeks = 50, then Total Problems Solved = 150 + 200 + 50 = 500.</p>
                    </div>
                </div>
            )
        },
        {
            title: "Overall Combined Score",
            content: (
                <div className="space-y-2">
                    <p>
                        The <strong>Overall Combined Score</strong> is a weighted sum that includes Average Contest Rating, Total Problems Solved, Total Active Days, Total Submissions, Total Contributions, and Hard Problems Solved.
                    </p>
                    <p>
                        Formula: (avgContestRating * 0.3) + (totalProblemsSolved * 0.2) + (totalActiveDays * 0.1) + (totalSubmissions * 0.1) + (totalContributions * 0.1) + (hardProblemsSolved * 0.2)
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">Example:</p>
                        <p>avgContestRating = 1500, totalProblemsSolved = 500, totalActiveDays = 25, totalSubmissions = 150, totalContributions = 50, hardProblemsSolved = 45</p>
                        <p>
                            Overall Score = (1500×0.3) + (500×0.2) + (25×0.1) + (150×0.1) + (50×0.1) + (45×0.2)
                        </p>
                    </div>
                </div>
            )
        },
        {
            title: "Combined (Submissions/Contributions) Activity",
            content: (
                <div className="space-y-2">
                    <p>
                        <strong>Total Activity Count</strong> is the sum of all submissions (LeetCode, CodeChef & CodeForce) and contributions (GitHub), while <strong>Average Activity per Day</strong> gives an insight into daily engagement.
                    </p>
                    <div className="bg-gray-50 p-3 rounded-md">
                        <p className="font-semibold">Example:</p>
                        <p>Total Activity Count = 200 (150 submissions + 50 contributions)</p>
                        <p>Average Activity per Day = 200 / 25 = 8</p>
                    </div>
                </div>
            )
        }
    ];


    const faqs = [
        {
            title: "How do I get started with the platform?",
            content:
                "To get started, sign up for an account, complete the onboarding tutorial, and add your coding profiles using your usernames. Follow our step-by-step guide to link your LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub accounts."
        },
        {
            title: "What should I do if I encounter an error after pressing the refresh button and new data is not loading?",
            content:
                "If you face an error after pressing the refresh button, first check your internet connection and verify that your profiles are correctly linked. If the issue persists, please try again after some time or contact our support team for further assistance."
        },
        {
            title: "My account is present but data is not being fetched, what can I do?",
            content:
                "If your account appears in our system but data isn’t updating, verify that your profile details are correct and that you've granted all necessary permissions. Also, ensure that the third-party platforms are accessible at the time of data fetch."
        },
        {
            title: "How do I add a new coding platform account to my unified dashboard?",
            content:
                "To add a new account, navigate to the 'Add Account' section, select the desired coding platform, and enter your profile details or credentials. Follow the on-screen instructions to authenticate and sync your data."
        },
        {
            title: "How does the platform consolidate data from various coding platforms?",
            content:
                "We aggregate data using a mix of APIs and secure web scraping techniques to gather metrics from LeetCode, CodeChef, Codeforces, GeeksforGeeks, and GitHub. This data is then normalized and displayed on your unified dashboard."
        },
        {
            title: "What is a Personal Access Token (PAT) and why is it required for GitHub integration?",
            content:
                "A PAT is a secure token that grants our platform access to additional GitHub data that requires authentication. It ensures that we can safely fetch extra information while keeping your account secure."
        },
        {
            title: "How can I generate and add a PAT for GitHub integration?",
            content:
                "Log in to your GitHub account, navigate to 'Settings > Developer Settings > Personal Access Tokens', and create a new token with the required permissions. Then, add this token in your profile settings on our platform to enable enhanced data fetching.",
            link:"https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
        },
        {
            title: "What should I do if my GitHub data is not updating due to PAT issues?",
            content:
                "If your GitHub data isn’t updating, check that your PAT is valid and has the necessary permissions. If it has expired or seems incorrect, generate a new token and update it in your profile settings."
        },
        {
            title: "How do I troubleshoot data synchronization issues on the platform?",
            content:
                "For synchronization issues, try refreshing your dashboard and verify that all linked account credentials are up-to-date. Consult our troubleshooting guide for step-by-step instructions or reach out to support for help."
        },
        {
            title: "Where can I find additional help if I encounter issues with account linking or data updates?",
            content:
                "For further assistance, visit our support center, check our comprehensive FAQ section, or contact our customer support team via email or live chat. We’re here to help resolve any technical or account-related issues."
        }
    ];


    return (
        <>
            <Navbar />
            <div
                className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-blue-100 to-blue-300"
                    }`}
            >
                <div className="max-w-3xl mx-auto mt-11">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? "text-white" : "text-black"}`}

                    >
                        Documentation & Guidelines
                    </motion.h1>

                    <Section
                        title="Guidelines"
                        icon={<BookOpenIcon className="w-6 h-6" />}
                        items={guidelines}
                        isDarkMode={isDarkMode}
                    />

                    <Section
                        title="Rules"
                        icon={<ShieldCheckIcon className="w-6 h-6" />}
                        items={rules}
                        isDarkMode={isDarkMode}
                    />

                    <Section
                        title="Privacy"
                        icon={<LockClosedIcon className="w-6 h-6" />}
                        items={privacy}
                        isDarkMode={isDarkMode}
                    />

                    <Section
                        title="Benefits"
                        icon={<SparklesIcon className="w-6 h-6" />}
                        items={benefits}
                        isDarkMode={isDarkMode}
                    />

                    <Section
                        title="Features"
                        icon={<ChartBarIcon className="w-6 h-6" />}
                        items={features}
                        isDarkMode={isDarkMode}
                    />

                    <Section
                        title="Calculations & Formulas"
                        icon={<CalculatorIcon className="w-6 h-6" />}
                        items={calculations}
                        isDarkMode={isDarkMode}
                    />

                    <Section
                        title="Frequently Asked Questions"
                        icon={<QuestionMarkCircleIcon className="w-6 h-6" />}
                        items={faqs}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Rules;
