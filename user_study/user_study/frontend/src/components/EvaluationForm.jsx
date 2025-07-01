function EvaluationForm() {
    return (
        <div className="">
            <p className="text-5xl text-left font-bold mb-10">AI Model Evaluation Form</p>

            <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSdY-0rsIFJOwyqVj5DbWPngi7s35LGXjbkzJQ1CoASipEZKyA/viewform?embedded=true" 
                width="640" 
                height="2320" 
                frameborder="0"
                marginheight="0" 
                marginwidth="0"
                className="flex items-center w-full"
            >
                Loading…
            </iframe>
        </div>
    )
}

export default EvaluationForm;