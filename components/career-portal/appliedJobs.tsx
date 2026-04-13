
import Image from "next/image";

type Job = {
    id: number;
    title: string;
    status: "In progress" | "Accepted" | "Rejected";
};

const jobs: Job[] = [
    {
        id: 1,
        title: "Software Engineer - Backend and Database Technologies",
        status: "In progress",
    },
    {
        id: 2,
        title: "React Frontend Developer",
        status: "Accepted",
    },
    {
        id: 3,
        title: "DevOps Engineer",
        status: "Rejected",
    },
];

export default function AppliedJobs() {
    return (
        <div className="flex flex-col gap-6">

            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="border border-orange-400 rounded-2xl p-6 flex items-center justify-between bg-white"
                >
                    {/* Left */}
                    <h2 className="text-lg font-semibold text-gray-800">
                        {job.title}
                    </h2>

                    {/* Right */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <StatusIcon status={job.status} />
                        <span className="text-sm font-medium">{job.status}</span>
                    </div>
                </div>
            ))}

        </div>
    );
}

function StatusIcon({ status }: { status: string }) {
    if (status === "In progress") {
        return <Image
            src="/processing.svg"
            alt="process"
            width={18}
            height={18}
        />;
    }

    if (status === "Accepted") {
        return <Image
            src="/checked.svg"
            alt="Accepted"
            width={18}
            height={18}
        />;;
    }

    if (status === "Rejected") {
        return <Image
            src="/reject.svg"
            alt="Rejected"
            width={18}
            height={18}
        />;;
    }

    return null;
}