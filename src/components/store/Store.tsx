import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

// SERVICES
import { getStore } from "@/backend/services/store/getStore";

// UI
import { Button } from "@/components/ui/button"
import Perfumes from "@/components/common/Perfumes"
import { LoadingScreen } from "../ui/loading";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// STATES
import useUserId from "@/lib/states/userId";
import useUserState from "@/lib/states/userStates";

// ICONS
import { MdAlternateEmail } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { IoShareSocial } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { toast } from "sonner";


export default function Store() {

    // Get the store ID from the URL
    const { id: storeURL } = useParams();

    const navigate = useNavigate();

    const
        // Display the loadingScreen while mounting
        [loadingComponent, setLoadingComponent] = useState<boolean>(true),
        // Get the loggedin user ID
        { loggedinUserId } = useUserId(),
        // Get if user logged state
        { isLoggedin } = useUserState(),
        [allowUserToUpdate, setAllowUserToUpdate] = useState<boolean>(false);

    // Pass the store details
    const
        [name, setName] = useState<string>(''),
        [logo, setLogo] = useState<string>(''),
        [bio, setBio] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [phone, setPhone] = useState<string>(''),
        [website, setWebsite] = useState<string>(''),
        [facebook, setFacebook] = useState<string>(''),
        [x, setX] = useState<string>(''),
        [youtube, setYoutube] = useState<string>(''),
        [instagram, setInstagram] = useState<string>('');

    // Update the page title
    document.title = `Glori | ${name} `;

    // Get Store
    useEffect(() => {
        if (storeURL) {
            // Check if the current loggedin user can Update the Store details based on ID:
            if (storeURL == loggedinUserId) {
                setAllowUserToUpdate(true)
            } else {
                setAllowUserToUpdate(false)
            }

            async function checkStoreState() {
                const results = await getStore(`${storeURL}`);
                if (results) {
                    if (results.code === 404) {
                        navigate('/')
                        document.title = `Glori | House of Fragrances`;
                        setLoadingComponent(false)
                    } else {
                        setName(results.name)
                        setLogo(results.logo)
                        setBio(results.bio)
                        setEmail(results.email)
                        setPhone(results.phone)
                        setWebsite(results.website)
                        setFacebook(results.facebook)
                        setX(results.x)
                        setYoutube(results.youtube)
                        setInstagram(results.instagram)

                        setLoadingComponent(false)
                    }
                }
            }
            checkStoreState();

        }
    }, [storeURL, loggedinUserId, isLoggedin]);

    // Handle Copy Store Link
    function copyStoreLink() {
        const linkElement = document.getElementById("storeLink") as HTMLInputElement;
        const value = linkElement.value;
        navigator.clipboard.writeText(value)
        toast.success("Store Link Copied")
    }


    if (loadingComponent) {
        return <LoadingScreen />
    } else {
        return (
            <div className="max-w-6xl mx-auto lg:w-[900px] px-4 md:px-6 py-16 md:py-16">

                {/* Header: Seller picture, name, username */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 md:mb-12">

                    <img src={`${logo}`} width={115} className="aspect-square rounded-full object-cover shadow-lg border border-white" />

                    <div className="flex flex-col md:flex-row items-start justify-between md:w-full text-center md:text-left">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
                            {/* <p className="text-gray-500 dark:text-gray-400">Store ID: {storeID}</p> */}
                        </div>
                    </div>

                    {/* Edit Profile + Sell New Perfume + Share*/}
                    <div className="flex flex-col items-center md:flex-row justify-center md:space-x-3 space-y-3 md:space-y-0 md:mt-0 w-full md:w-fit">

                        <Link to="/update" className={`${allowUserToUpdate && isLoggedin ? '' : 'hidden'} w-fit mx-auto md:mx-0`}>
                            <Button variant="outline" className="text-sm w-fit">
                                Update board
                            </Button>
                        </Link>
                        {/* <Link to="/sell" className="w-fit mx-auto md:mx-0">
                            <Button variant="default" className="text-sm w-fit">
                                Sell New Perfume
                            </Button>
                        </Link> */}

                        {/* Share Product */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button><IoShareSocial size="20" /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Share {name}</DialogTitle>
                                    <DialogDescription>
                                        Share this store with friends now by copying the link below!
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center space-x-2">
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="link" className="sr-only">
                                            Link
                                        </Label>
                                        <Input
                                            id="storeLink"
                                            value={`${window.location.origin}/store/${storeURL}`}
                                            readOnly
                                        />
                                    </div>
                                    <Button onClick={copyStoreLink} type="submit" size="sm" className="px-3">
                                        <span className="sr-only">Copy</span>
                                        <FaRegCopy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>

                {/* Bio + Contact Us */}
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 mb-8 md:mb-12 text-md">
                    <div>
                        <h2 className="text-lg font-bold mb-4">About {name}</h2>
                        <p className="text-gray-500 leading-relaxed md:w-5/6">{bio}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-4">Contact {name}</h2>

                        {/* Phone + Emali + Website */}
                        <div className="flex flex-col space-y-1 text-md">
                            <div className="flex items-center gap-2">
                                <MdAlternateEmail className="w-5 h-5 text-gray-500" />
                                <a href={`mail:${email}`} className="text-gray-500 hover:underline">
                                    {email}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MdOutlinePhone className="w-5 h-5 text-gray-500" />
                                <a href="#" className="text-gray-500 hover:underline">
                                    {phone}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <TbWorldWww className="w-5 h-5 text-gray-500" />
                                <a
                                    href={website}
                                    className="text-gray-500 hover:underline"
                                    target="_blank"
                                >
                                    {website}
                                </a>
                            </div>
                        </div>

                        {/* Media Icons */}
                        <div className="flex justify-start w-full rounded-lg mt-3">
                            <Link to={instagram} className="mr-3">
                                <img src="/images/icons/insta.png" height="25" width="25" />
                            </Link>
                            <Link to={x} className="mr-3">
                                <img src="/images/icons/x.png" height="25" width="25" />
                            </Link>
                            <Link to={youtube} className="mr-3">
                                <img src="/images/icons/ytube.png" height="25" width="25" />
                            </Link>
                            <Link to={facebook} className="mr-3">
                                <img src="/images/icons/face.png" height="25" width="25" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <Perfumes AllowFiltering={true} />
            </div>

        )
    }
}

