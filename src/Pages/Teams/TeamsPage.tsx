import raffa from "../../assets/TEAMS/raffa.png"
import rahsya from "../../assets/TEAMS/rahsya.png"
import hapiz from "../../assets/TEAMS/hapiz.png"
import abyan from "../../assets/TEAMS/abyan.png"
import line from "../../assets/VELO/line.png"

type Props = {}


const teamMembers = [
    {
        name: 'Rahsya Benova Akbar',
        role: 'Fullstack Developer',
        quote: 'I Like Cat, And I Like Her',
        image: rahsya,
        bgColor: 'bg-white',
        bgBorder: 'border-[#7ecd50]',
        bg: 'bg-[#7ecd50]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com' },
            { icon: 'fab fa-linkedin', link: 'https://linkedin.com' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com' }
        ]
    },
    {
        name: 'Raffa Eka Prayoga',
        role: 'Fullstack Developer',
        quote: 'I Love Lorem Ipsum And I Love Solusi Data Madani',
        image: raffa,
        bgColor: 'bg-white',
        bgBorder: 'border-[#54afe5]',
        bg: 'bg-[#54afe5]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com' },
            { icon: 'fab fa-linkedin', link: 'https://linkedin.com' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com' }
        ]
    },
    {
        name: 'Abyan Khairi Risha',
        role: 'Fullstack Developer',
        quote: 'Never Surrender & Forever',
        image: abyan,
        bgColor: 'bg-white',
        bgBorder: 'border-[#f1487a]',
        bg: 'bg-[#f1487a]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com' },
            { icon: 'fab fa-linkedin', link: 'https://linkedin.com' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com' }
        ]
    },
    {
        name: 'Hafizhurrahman',
        role: 'UI & UX Designer',
        quote: 'I Love Tyler & Kanye',
        image: hapiz,
        bgColor: 'bg-white',
        bgBorder: 'border-[#fbcb41]',
        bg: 'bg-[#fbcb41]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com' },
            { icon: 'fab fa-linkedin', link: 'https://linkedin.com' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com' }
        ]
    },
];

export default function TeamsPage({ }: Props) {
    return (
        <>
            <div className="text-center -mt-5">
                <div className="">
                    <p className="text-slate-400" >Behind The Food</p>
                    <h1 className="font-bold text-5xl my-3">Meet the Cooker</h1>
                    <p className="text-slate-500 text-2xl mb-16 font-medium" >Meet our team of professionals to serve you </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 p-6">
                {teamMembers.map((member, index) => (
                    <div key={index} className={`w-60 p-4 pb-9 rounded-xl ${member.bgColor} border-2 ${member.bgBorder} text-center`}>
                        <div
                            className="absolute inset-0 rounded-t-lg"
                            style={{
                                backgroundImage: `url(${line})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.1,
                            }}
                        />
                        <div className="flex justify-center mb-4">
                            <div className={`absolute w-60  -mt-4 h-10 rounded-t-lg ${member.bg} `}
                                style={{
                                    backgroundImage: `url(${line})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    // opacity: 0.2,
                                }}
                            />
                            <div className="w-32 h-32 rounded-full overflow-hidden  z-10 mt-8 p-1">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold">{member.name}</h2>
                        <p className="text-gray-600">{member.role}</p>
                        <p className="mt-2 italic text-gray-500">"{member.quote}"</p>
                        <div className="flex justify-center gap-4 mt-4 ">
                            {member.icons.map((icon, idx) => (
                                <a key={idx} href={icon.link} target="_blank" rel="noopener noreferrer" className="text-gray-700 z-20 hover:text-gray-900">
                                    <i className={icon.icon + " text-xl z-10"}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

