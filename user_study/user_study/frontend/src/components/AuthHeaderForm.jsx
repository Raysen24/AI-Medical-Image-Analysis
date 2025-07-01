function AuthHeaderForm({text}) {
    return (
        <>
            <div className="h-16 bg-blueish w-1">
            </div>
            <div>
                <h1 className="text-white font-bold text-3xl mb-1">NUMED <span className="text-blueish">BINUS</span></h1>
                <p className="text-base font-medium">{text} </p>
            </div>
        </>
    )
}

export default AuthHeaderForm;