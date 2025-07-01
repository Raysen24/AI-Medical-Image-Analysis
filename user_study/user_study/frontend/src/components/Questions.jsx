// src/components/Questions.jsx
import React from 'react';
import { URL } from "../../api/APIconst";

function Questions({ questionData, selectedAnswer, handleAnswerChange, currentPretest, currentQuestion, currentImageIndex, handleNextImage, handlePrevImage }) {
    console.log("this is question.jsx line 5, the current Question:  ", currentPretest.images)

    return (
        <div className="flex justify-between items-center gap-32">
            <div className="bg-nonary w-[450px] h-[450px] relative">
                <div className="image-container">
                    {currentPretest.images.length > 0 && (
                        <img
                            // src={`http://127.0.0.1:8000/${currentPretest.images[currentImageIndex].pre_test_image}`}
                            // alt={`Question ${currentQuestion} - Image ${currentImageIndex + 1}`}
                            // style={{ maxWidth: '100%', height: 'auto' }}
                            src={`${URL}/${currentPretest.images[currentImageIndex].pre_test_image}`}
                            alt={`Question ${currentQuestion} - Image ${currentImageIndex + 1}`}
                            style={{ width: '450px', height: '450px' }}
                        />
                    )}
                    {currentPretest.images.length > 1 && (
                        <div className="image-navigation absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
                            {currentImageIndex > 0 && (
                                <button
                                    onClick={handlePrevImage}
                                    className="bg-white rounded-full p-2 shadow"
                                    style={{ color: 'black' }}
                                >
                                    ◀
                                </button>
                            )}
                            {currentImageIndex < currentPretest.images.length - 1 && (
                                <button
                                    onClick={handleNextImage}
                                    className="bg-white rounded-full p-2 shadow ml-auto" // Add ml-auto to push it to the right
                                    style={{ color: 'black' }}
                                >
                                    ▶
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-left flex-1">
                <div>
                    <p className="text-4xl">{questionData.questionText || "What is the disease?"}</p>
                </div>
                <div>
                    {questionData.choices.map((choice, index) => (
                        <div
                            key={index}
                            className="bg-senary w-full rounded-2xl p-5 mt-10 flex items-center gap-4"
                        >
                            <input
                                id={`radio-${index}`}
                                type="radio"
                                name="answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => handleAnswerChange(index)}
                                className="custom-checkbox" // Keep the checkbox style
                            />
                            <label htmlFor={`radio-${index}`} className="text-2xl">
                                {choice}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Questions;
