import raffa from "../../assets/TEAMS/raffa.png"
import rahsya from "../../assets/TEAMS/rahsya.png"
import hapiz from "../../assets/TEAMS/hapiz.png"
import abyan from "../../assets/TEAMS/abyan.png"
import line from "../../assets/VELO/line.png"

type Props = {}


const teamMembers = [
    {
        name: 'Rahsya Benova A.',
        role: 'Fullstack Developer',
        quote: 'I Like Cat, And I Like Her',
        image: rahsya,
        bgColor: 'bg-white',
        bgBorder: 'border-[#7ecd50]',
        bg: 'bg-[#7ecd50]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com/RahsyaBenova' },
            { icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/rahsya-benova-akbar-88576031b' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com/rahsyabenova' }
        ]
    },
    {
        name: 'Raffa Eka P.',
        role: 'Fullstack Developer',
        quote: 'Coding Is Fun',
        image: raffa,
        bgColor: 'bg-white',
        bgBorder: 'border-[#54afe5] ',
        bg: 'bg-[#54afe5]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com/RaffaEkaPrayoga' },
            { icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/raffa-eka-prayoga-8912b6320/' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com/raffaekaprayoga' }
        ]
    },
    {
        name: 'Abyan Khairi R.',
        role: 'Fullstack Developer',
        quote: '01001111 01101011 01100101',
        image: abyan,
        bgColor: 'bg-white',
        bgBorder: 'border-[#f1487a]',
        bg: 'bg-[#f1487a]',
        icons: [
            { icon: 'fab fa-github', link: 'https://github.com/abyanKhairi' },
            { icon: 'fab fa-linkedin', link: 'https://linkedin.com' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com/khairi.risha' }
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
            { icon: 'fab fa-github', link: 'https://github.com/BukanNezon' },
            { icon: 'fab fa-linkedin', link: 'https://www.linkedin.com/in/hafizh-urrahman-8870362bb/?original_referer=https%3A%2F%2Fgithub.com%2F' },
            { icon: 'fab fa-instagram', link: 'https://instagram.com/pizurrr_' }
        ]
    },
];

export default function TeamsPage({ }: Props) {
    return (
        <>
            <div className="text-center mt-5 mb-5">
                <div className="">
                    <p className="text-slate-400" >Behind The Food</p>
                    <h1 className="font-bold text-4xl 2xl:text-5xl my-3">Meet the Cooker</h1>
                    <p className="text-slate-500 text-xl 2xl:text-2xl mb-16 font-medium" >Meet our team of professionals to serve you </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 ">
                {teamMembers.map((member, index) => (
                    <div key={index} className={`w-[12.6rem] 2xl:w-60 p-4 pb-5 rounded-xl justify-center ${member.bgColor} border-2 ${member.bgBorder} text-center flex flex-col`}>
                        <div className="flex justify-center mb-4 relative">
                            <div
                                className={`absolute w-[12.6rem] 2xl:w-60 -mt-4 h-7 rounded-t-lg ${member.bg}`}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `url(${line})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        opacity: 0.3,
                                    }}
                                />
                            </div>
                            <div className="w-36 h-32 rounded-full overflow-hidden z-10 mt-8 p-1">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Wrap the content above the icons in a flex-grow container */}
                        <div className="flex-grow">
                            <h2 className="text-lg font-semibold">{member.name}</h2>
                            <p className="text-gray-800 text-sm">{member.role}</p>
                        </div>

                        <div className="flex-grow">
                            <p className="mt-2 italic text-sm text-gray-500">"{member.quote}"</p>
                        </div>

                        {/* Social icons container */}
                        <div className="flex justify-center gap-4 mt-2">
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