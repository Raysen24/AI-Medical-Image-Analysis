import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Questions from "./Questions";
import { URL } from "../../api/APIconst"

function DoctorPretest({ allPretestData, currentQuestion, totalQuestions, currentPretest, currentImageIndex, handleNextImage, handlePrevImage, handleBack, handleNext }) {
    const [shuffledChoicesState, setShuffledChoicesState] = useState({});
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const nav = useNavigate();

    useEffect(() => {
        const currentQuestionData = allPretestData[currentQuestion - 1];

        if (currentQuestionData && !shuffledChoicesState[currentQuestion]) {
            const choices = [
                currentQuestionData.pre_test_answer,
                currentQuestionData.alternative_answer_1,
                currentQuestionData.alternative_answer_2,
                currentQuestionData.alternative_answer_3
            ];
            const shuffledChoices = shuffleArray(choices);
            setShuffledChoicesState(prevState => ({
                ...prevState,
                [currentQuestion]: shuffledChoices
            }));
        }
    }, [currentQuestion, allPretestData, shuffledChoicesState]);

    const handleAnswerChange = (index) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [currentQuestion]: index
        }));
    };

    const selectedAnswersInWords = Object.keys(selectedAnswers).reduce((acc, question) => {
        const questionIndex = parseInt(question);
        const selectedAnswerIndex = selectedAnswers[questionIndex];
        const selectedWord = shuffledChoicesState[questionIndex]
            ? shuffledChoicesState[questionIndex][selectedAnswerIndex]
            : null;

        if (selectedWord) {
            acc[questionIndex] = selectedWord;
        }

        return acc;
    }, {});

    console.log('Selected answers in words:', selectedAnswersInWords);

    function calculateScore(selectedAnswersInWords, allPretestData) {
        let score = 0;

        Object.keys(selectedAnswersInWords).forEach(questionId => {
            const questionIndex = parseInt(questionId);
            const selectedAnswer = selectedAnswersInWords[questionIndex];
            
            const questionData = allPretestData[questionIndex - 1];

            if (questionData) {
                console.log(`Question ${questionIndex}: Selected Answer = ${selectedAnswer}, Correct Answer = ${questionData.pre_test_answer}`);
                if (selectedAnswer === questionData.pre_test_answer) {
                    score += 1;
                }
            } else {
                console.log(`Question ${questionIndex} data not found!`);
            }
        });

        return score;
    }

    const handleButtonClick = async () => {
        if (currentQuestion < totalQuestions) {
            handleNext();
        } else {
            const score = calculateScore(selectedAnswersInWords, allPretestData);
            console.log('Calculated score:', score);
            // alert(`Your score is: ${score}`);
    
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                alert('Unable to submit answers. No authentication token found.');
                return;
            }
    
            try {
                const response = await fetch(`${URL}/submit-pretest`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(selectedAnswersInWords),  // Use selectedAnswersInWords here
                });
    
                if (response.ok) {
                    const result = await response.json();
                    // alert(`Your score from backend: ${result.score}`);
    
                    // Store score in local storage
                    localStorage.setItem('pretestScore', result.score);
    
                    // Navigate to Satisfactory component
                    if (result.score < 10) {
                        nav('/unsatisfactory');
                    } else {
                        nav('/satisfactory');
                    }
                } else {
                    console.error('Failed to submit answers:', response.statusText);
                    alert('Failed to submit answers. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting your answers.');
            }
        }
    };
    

    const currentQuestionData = allPretestData[currentQuestion - 1]?.images[0];
    const selectedAnswer = selectedAnswers[currentQuestion];

    return (
        <div className="text-left w-full">
            <div className="my-5 flex justify-between items-center">
                <div>
                    <p className="text-5xl font-bold">Pre-Test</p>
                </div>
                <div>
                    <p className="text-4xl font-light">{currentQuestion} of {totalQuestions} questions</p>
                </div>
            </div>
            <div className="my-20">
                {currentQuestionData && shuffledChoicesState[currentQuestion] && (
                    <Questions
                        questionData={{
                            ...currentQuestionData,
                            choices: shuffledChoicesState[currentQuestion]
                        }}
                        selectedAnswer={selectedAnswer}
                        currentPretest={currentPretest}
                        currentQuestion={currentQuestion}
                        currentImageIndex={currentImageIndex}
                        handleAnswerChange={handleAnswerChange}
                        handleNextImage={handleNextImage}
                        handlePrevImage={handlePrevImage}
                    />
                )}
            </div>
            <div className="flex justify-between mt-28">
                <div>
                    {currentQuestion > 1 && (
                        <Button
                            radius="lg"
                            size="lg"
                            className="border border-white px-16 border-2 py-7 bg-transparent text-white font-bold text-xl"
                            type="button"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                    )}
                </div>
                <div className="flex-grow" />
                <div>
                    <Button
                        radius="lg"
                        size="lg"
                        className="px-16 py-7 bg-blueish text-white font-bold text-xl"
                        type="button"
                        onClick={handleButtonClick}
                    >
                        {currentQuestion < totalQuestions ? "Next" : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}

export default DoctorPretest;
