import {Button} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios"
import { URL } from "../../api/APIconst"

function ConsentForm() {
    const [isChecked, setIsChecked] = useState(false);
    const nav = useNavigate(); 

    const handleSubmit = async () => {
        const storedScore = localStorage.getItem('pretestScore');
        if (isChecked) {
            if (storedScore == 10) {
                try {
                    const token = localStorage.getItem('token');

                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
                    const response = await axios.get(URL+"/logbooks/get/1").catch((e) => console.error(e))
                    console.log(response.data);
                    if (response.statusText != "OK") throw new Error(`Response status: ${response.status}`);

                    const last_patient = response.data[0].last_patient;
                    const patient_count = response.data[0].patient_count + 1;
                    const logbook_id = response.data[0].logbook_id;

                    console.log("Last Patient:", last_patient);
                    console.log("Patient Count:", patient_count);
                    console.log("Logbook ID:", logbook_id);
                    if (last_patient && patient_count && logbook_id) {
                        nav(`/prediction`, { state: { last_patient, patient_count, logbook_id } });
                    } else {
                        console.warn("No last_patient found for logbook:", logbook_id);
                    }         
                } catch (error) {
                    console.error("Error fetching last patient for logbook:", error);
                }
            } else {
                nav("/pretest");
            }
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <>
            <div className="absolute h-full bg-secondary w-48">
            </div>
            <div className="pl-64 w-screen min-h-screen py-20 pr-20">
                <div className="text-left">
                    <div className="mb-5">
                        <p className="text-5xl font-bold">Privasi dan Penggunaan Data</p>
                    </div>
                    <div className="text-xl mb-5">
                        <p className="font-regular mb-5">Selamat datang di Numed! Kami berkomitmen untuk meningkatkan pengalaman perawatan kesehatan Anda dengan analisis medis canggih dan teknologi prediktif. Kesehatan dan privasi Anda adalah prioritas utama kami. Berikut adalah cara kami mengumpulkan, menggunakan, dan melindungi data Anda.</p>

                        <p className="font-bold mt-5">Tujuan Pengumpulan Data</p>
                        <p className="font-regular mb-5">Numed mengumpulkan informasi pribadi dan kesehatan Anda untuk memberikan analisis medis yang akurat dan personal. Tujuan kami adalah membantu Anda dengan wawasan untuk deteksi dini, pencegahan, dan pengelolaan kondisi kesehatan.</p>

                        <p className="font-bold mt-5">Informasi Pribadi yang Kami Kumpulkan</p>
                        <ul className="list-disc ml-10 mb-5">
                            <li>Nama</li>
                            <li>Tanggal Lahir</li>
                            <li>Informasi Kontak (email, nomor telepon)</li>
                        </ul>

                        <p className="font-bold mt-5">Informasi Kesehatan</p>
                        <ul className="list-disc ml-10 mb-5">
                            <li>Riwayat Medis</li>
                            <li>Imaging Reports</li>
                        </ul>

                        <p className="font-bold mt-5">Bagaimana Kami Menggunakan Data Anda</p>
                        <ul className="list-decimal ml-10 mb-5">
                            <li>Analisis Medis: Kami menggunakan algoritma canggih untuk menganalisis data kesehatan Anda dan memberikan wawasan serta rekomendasi yang disesuaikan dengan profil Anda.</li>
                            <li>Prediksi Kesehatan: Kami menggunakan model prediktif untuk meramalkan potensi masalah kesehatan dan menyarankan langkah-langkah pencegahan, membantu Anda tetap sehat.</li>
                        </ul>
                        
                        <p className="font-regular mt-5">Dengan menggunakan layanan Numed, Anda menyetujui pengumpulan, penggunaan, dan pembagian data Anda seperti yang dijelaskan di atas. Partisipasi Anda membantu kami meningkatkan hasil perawatan kesehatan dan memberikan wawasan kesehatan yang berharga. Terima kasih telah mempercayakan perjalanan kesehatan Anda kepada Numed.</p>
                        <p className="font-regular mt-10 underline font-medium">
                            Di dalam aplikasi ini terdapat fitur logbook yang akan dibuat setiap kali dokter login. Logbook memiliki kuota 30 entri per hari, namun jika Anda ingin melanjutkan, Anda dapat melakukannya hanya dengan menekan tombol yang tersedia.
                        </p>
                    </div>
                    <div className="mt-10 flex gap-7 justify-start">
                        <input 
                            type="checkbox" 
                            className="w-20 h-20 -mt-5"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <p className="font-regular text-3xl">
                            Saya menyetujui pengumpulan, penggunaan, dan pemrosesan data pribadi dan kesehatan saya oleh Numed untuk tujuan analisis medis, analitik prediktif, dan rekomendasi yang dipersonalisasi sebagaimana dijelaskan dalam kebijakan Privasi dan Penggunaan Data.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <Button
                            radius="sm"
                            size="lg"
                            className="bg-blueish text-white font-bold text-xl mt-16 px-20 py-5"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!isChecked}
                        >
                            Continue
                        </Button>
                    </div>
                    


                </div>
            </div>
        </>
    )
}

export default ConsentForm;