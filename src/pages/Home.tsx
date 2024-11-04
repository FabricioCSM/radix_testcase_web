import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import AppContext from "../context/AppContext";
import { toast } from 'sonner'
import { getReadingsStatistics } from '../http/get-statistics';
import sonda_image from '../assets/sonda.svg';
import { StatisticsDashboard } from '../components/statistic-dashboard';
import { Button } from '../components/ui/button';
import { Download, Upload } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
import Spinner from '../components/ui/spinner';
import { uploadSensorData } from '../http/upload_sensor_data';

export function Home() {
    const [timePeriod, setTimePeriod] = useState(24);
    const appContext = useContext(AppContext);
    const [file, setFile] = useState<File | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: statisticsData, isLoading: isLoadingStatistics, status: statusFetchingStatistics, error: errorFetchingStatistics } = useQuery({
        queryKey: ['sensor-statistics', timePeriod],
        queryFn: () => getReadingsStatistics(timePeriod),
        enabled: !!appContext?.username,
    });

    if (statusFetchingStatistics === 'error') {
        if (errorFetchingStatistics.message.includes('not authorized')) toast.error('User not authorized, please Log in and try again!')
        else {
            toast.error('Error while fetching statistics, please try again!')
        }
    }

    const downloadSample = () => {
        const csvRows: string[] = [];
        
        csvRows.push(['equipmentId', 'timestamp', 'value'].join(','));

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sample_file.csv');
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); 
    };

    const handleUploadSensorData = async () => {
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        try {
            await uploadSensorData(file);
            toast.success('File uploaded successfully!');
            setFile(null);
            setIsDialogOpen(false);
        } catch (error) {
            toast.error('Failed to upload file. Please try again.');
        }
    };

    return (
        <div className='relative flex flex-col justify-center w-screen p-20'>
            <img
                src={sonda_image}
                alt="page background image, an oil sonda"
                className="absolute top-0 left-0 right-0 mx-auto w-auto  object-cover opacity-5"
            />

            {appContext?.username && appContext.username.length > 0 ? (
                <div className='z-50'>
                    <div className='relative z-10 flex flex-row justify-between'>
                        <div>
                            <Button className='mr-2 bg-customGreen' onClick={() => setTimePeriod(24)}>
                                <CalendarDays /> 24h
                            </Button>
                            <Button className='mr-2 bg-customGreen' onClick={() => setTimePeriod(48)}>
                                <CalendarDays /> 48h
                            </Button>
                            <Button className='mr-2 bg-customGreen' onClick={() => setTimePeriod(24 * 7)}>
                                <CalendarDays /> 1 week
                            </Button>
                            <Button className='mr-2 bg-customGreen' onClick={() => setTimePeriod(24 * 7 * 4 + 2)}>
                                <CalendarDays /> 1 month
                            </Button>
                        </div>
                        <Dialog onOpenChange={setIsDialogOpen}>
                            <DialogTrigger>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Upload /> Upload File
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Upload File</DialogTitle>

                                <div className='p-10'>
                                    <h3>* To upload the file, make sure the file is in CSV and in the same format as the sample</h3>
                                    <div>
                                        <Button onClick={downloadSample} className='w-36 bg-customPurple'><Download/> Sample</Button>
                                    </div>


                                    <input 
                                        type="file" 
                                        accept=".csv" 
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setFile(e.target.files[0]);
                                            }
                                        }} 
                                        className='mt-16'
                                    />
                                        
                                    <div className='flex justify-between mt-4 '>
                                        <Button onClick={handleUploadSensorData} className='w-36 bg-customGreen'><Upload /> Upload File</Button>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setIsDialogOpen(false)} className='w-36 bg-gray-400 mt-20'>Cancel</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                    {isLoadingStatistics || !statisticsData ? (
                        <div className='flex flex-col items-center mt-16'>
                            <p className="relative z-10">Loading statistics data...</p>
                            <Spinner />
                        </div>
                    ) : (
                        <StatisticsDashboard statisticsData={statisticsData} />
                    )}

                </div>
            ) : (
                <div className='text-center font-sans text-2xl mt-[15%]'>
                    <h2 className='font-bold mb-4'>Welcome!</h2>

                    <p>Our monitoring system makes it easy to control your equipment, to access, please log in</p>
                </div>
            )}

        </div>
    );
}
