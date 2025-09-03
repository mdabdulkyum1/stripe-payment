
import { Suspense } from 'react';
import PaymentForm from "./components/PaymentForm";
import Loading from '../components/loading/Loading';

const page = () => {
    return (


        <Suspense fallback={<div><Loading></Loading></div>}>
            <div className="mt-20">
            <PaymentForm></PaymentForm>
            </div>
       
        </Suspense>





    );
};

export default page;