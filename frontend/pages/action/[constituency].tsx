import { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import BackButton from '@/components/ui/BackButton';
import { PageSpinner } from '@/components/ui/PageSpinner';

// --- ICONS ---
const MailIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const DocumentTextIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const GavelIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.474-4.474c-.047-.58-.022-1.193-.14-1.743M15.158 11.42l-2.496-3.03c-.317-.384-.74-.664-1.208-.766M15.158 11.42L-2.08 18.332a2.548 2.548 0 003.586 3.586L15.158 11.42z" />
    </svg>
);

const ShieldCheckIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

const CopyIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ExternalLinkIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

// --- UI Components ---
const DocumentViewer = ({ content, onCopy, copied }: { content: string, onCopy: () => void, copied: boolean }) => (
    <div className="relative group">
        <button
            onClick={onCopy}
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300"
            disabled={copied}
        >
            {copied ? (
                <>
                    <CheckIcon className="h-4 w-4 text-green-600" />
                    Copied
                </>
            ) : (
                <>
                    <CopyIcon className="h-4 w-4" />
                    Copy
                </>
            )}
        </button>
        <div className="w-full max-h-96 p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl font-mono text-sm overflow-y-auto shadow-inner">
            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{content}</pre>
        </div>
    </div>
);

const DocumentCard = ({ icon: Icon, title, subtitle, children }: { 
    icon: React.ElementType, 
    title: string, 
    subtitle?: string,
    children: React.ReactNode 
}) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    {subtitle && (
                        <p className="text-gray-600 dark:text-gray-400 text-base">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
        <div className="p-8">
            {children}
        </div>
    </div>
);

const StatusBadge = ({ status, lastDate }: { status: string, lastDate: string | null }) => {
    const isOutdated = status === 'Outdated';
    const bgColor = isOutdated ? 'bg-amber-100 dark:bg-amber-900/20' : 'bg-red-100 dark:bg-red-900/20';
    const textColor = isOutdated ? 'text-amber-800 dark:text-amber-400' : 'text-red-800 dark:text-red-400';
    
    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${bgColor} ${textColor}`}>
            <div className={`w-2 h-2 rounded-full ${isOutdated ? 'bg-amber-500' : 'bg-red-500'}`} />
            Report is {status.toLowerCase()}
            {isOutdated && lastDate && (
                <span className="text-sm opacity-75">• Last seen: {lastDate}</span>
            )}
        </div>
    );
};

const InstructionsList = ({ steps }: { steps: string[] }) => (
    <div className="space-y-4 mb-8">
        {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
            </div>
        ))}
    </div>
);

// --- MAIN PAGE ---
interface ActionPageProps {
    mpName: string;
    constituencyName: string;
    mpEmail: string;
    status: 'Missing' | 'Outdated';
    lastDate: string | null;
    apiUrl: string;
}

const ActionPage: NextPage<ActionPageProps> = ({ 
    mpName, 
    constituencyName, 
    mpEmail, 
    status, 
    lastDate, 
    apiUrl 
}) => {
    const [step, setStep] = useState(1);
    const [docs, setDocs] = useState({ rti_application: '', first_appeal: '', pil_brief: '' });
    const [copiedDoc, setCopiedDoc] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const finding = `The official transparency report is ${status.toLowerCase()}${status === 'Outdated' ? ` (last seen: ${lastDate || 'unknown date'})` : ''}.`;
    
    const letterText = `Subject: Request for MPLADS Transparency - ${constituencyName}

Dear ${mpName},

I am writing as a concerned constituent of ${constituencyName} to request transparency regarding the MPLADS expenditure report for our constituency.

Currently, the MPLADS report appears to be ${status.toLowerCase()}${status === 'Outdated' ? ` (last updated: ${lastDate || 'unknown date'})` : ''}. Access to timely and transparent information about the utilization of public funds is essential for democratic accountability.

I respectfully request that you take the necessary steps to publish the latest, complete MPLADS report for our constituency at your earliest convenience.

Thank you for your attention to this important matter.

Sincerely,
A Concerned Citizen of ${constituencyName}`;

    const handleGenerateDocs = async () => {
        setIsGenerating(true);
        setStep(2);
        
        try {
            const response = await fetch(`${apiUrl}/api/v1/legal/generate-docs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    constituency_name: constituencyName, 
                    mp_name: mpName, 
                    finding 
                }),
            });
            
            if (!response.ok) {
                throw new Error((await response.json()).detail || 'Failed to generate documents');
            }
            
            const data = await response.json();
            setDocs(data);
            setStep(3);
        } catch (error) {
            alert(`An error occurred: ${error instanceof Error ? error.message : "Please try again."}`);
            setStep(1);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async (content: string, docType: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedDoc(docType);
            setTimeout(() => setCopiedDoc(null), 3000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <>
            <Head>
                <title>Action Hub - {constituencyName}</title>
                <meta name="description" content={`Take action for transparency in ${constituencyName} represented by ${mpName}`} />
            </Head>
            
            {isGenerating && <PageSpinner />}

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                            Accountability Action Hub
                        </h1>
                        <div className="max-w-3xl mx-auto space-y-4">
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                Take action for <span className="font-bold text-gray-900 dark:text-white">{mpName}</span> of{' '}
                                <span className="font-bold text-gray-900 dark:text-white">{constituencyName}</span>
                            </p>
                            <StatusBadge status={status} lastDate={lastDate} />
                        </div>
                    </div>

                    {/* Step 1: Action Options */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Email Option */}
                            <div className="group bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="text-center">
                                    <div className="inline-flex p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <MailIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Direct Outreach
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                        Send a respectful, pre-drafted email directly to your MP requesting transparency. 
                                        A simple first step that shows civic engagement.
                                    </p>
                                    <a
                                        href={`mailto:${mpEmail}?subject=${encodeURIComponent('Request for MPLADS Transparency - ' + constituencyName)}&body=${encodeURIComponent(letterText)}`}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/button"
                                    >
                                        <MailIcon className="w-5 h-5 group-hover/button:rotate-12 transition-transform" />
                                        Draft Email
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Legal Option */}
                            <div className="group bg-white dark:bg-gray-900 p-8 rounded-2xl border-2 border-red-200 dark:border-red-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                                <div className="text-center">
                                    <div className="inline-flex p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <GavelIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Legal Documentation
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                        Generate official RTI applications and legal documents using AI. 
                                        Escalate to formal legal channels when transparency is lacking.
                                    </p>
                                    <button
                                        onClick={handleGenerateDocs}
                                        disabled={isGenerating}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group/button"
                                    >
                                        <GavelIcon className="w-5 h-5 group-hover/button:rotate-12 transition-transform" />
                                        {isGenerating ? 'Generating...' : 'Generate Legal Documents'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Generated Documents */}
                    {step === 3 && (
                        <div className="space-y-12 max-w-5xl mx-auto">
                            {/* RTI Application */}
                            <DocumentCard 
                                icon={DocumentTextIcon} 
                                title="RTI Application"
                                subtitle="Your legal right to demand transparency"
                            >
                                <InstructionsList steps={[
                                    "Copy the AI-generated RTI application below",
                                    "Visit the official Government of India RTI portal",
                                    "Create a new RTI request and paste the text",
                                    "Submit your application and save the reference number"
                                ]} />
                                
                                <DocumentViewer 
                                    content={docs.rti_application} 
                                    onCopy={() => copyToClipboard(docs.rti_application, 'rti')}
                                    copied={copiedDoc === 'rti'}
                                />
                                
                                <div className="mt-6">
                                    <a
                                        href="https://rtionline.gov.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Visit RTI Portal
                                        <ExternalLinkIcon className="w-4 h-4" />
                                    </a>
                                </div>
                            </DocumentCard>

                            {/* First Appeal */}
                            <DocumentCard 
                                icon={ShieldCheckIcon} 
                                title="First Appeal Template"
                                subtitle="For when your RTI request is ignored or inadequately answered"
                            >
                                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <p className="text-amber-800 dark:text-amber-400 font-medium">
                                        Use this if you don't receive a satisfactory response within 30 days of your RTI application.
                                    </p>
                                </div>
                                
                                <DocumentViewer 
                                    content={docs.first_appeal} 
                                    onCopy={() => copyToClipboard(docs.first_appeal, 'appeal')}
                                    copied={copiedDoc === 'appeal'}
                                />
                            </DocumentCard>

                            {/* PIL Brief */}
                            <DocumentCard 
                                icon={GavelIcon} 
                                title="Public Interest Litigation Brief"
                                subtitle="For legal consultation on systemic transparency issues"
                            >
                                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-blue-800 dark:text-blue-400 font-medium">
                                        This document can be shared with a lawyer to evaluate the possibility of filing a 
                                        Public Interest Litigation case for systemic transparency issues.
                                    </p>
                                </div>
                                
                                <DocumentViewer 
                                    content={docs.pil_brief} 
                                    onCopy={() => copyToClipboard(docs.pil_brief, 'pil')}
                                    copied={copiedDoc === 'pil'}
                                />
                            </DocumentCard>
                        </div>
                    )}
                </div>
                
                <BackButton />
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { constituency, mp, email, status, lastDate } = context.query;
    
    const formatName = (slug: string = '') => 
        slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    
    if (!constituency || !mp || !status || (status !== 'Missing' && status !== 'Outdated')) {
        return { notFound: true };
    }
    
    return {
        props: {
            constituencyName: formatName(constituency as string),
            mpName: mp as string,
            mpEmail: (email as string) || '',
            status: status as 'Missing' | 'Outdated',
            lastDate: (lastDate as string) || null,
            apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
        },
    };
};

export default ActionPage;