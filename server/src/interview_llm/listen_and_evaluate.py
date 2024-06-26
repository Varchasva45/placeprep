import speech_recognition
import pyttsx3
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI
import json
import sys

def initialize_llm_chain():
    template = """Welcome to the interview session! As the interviewer, your task is to evaluate responses from candidates for software engineering positions. You'll be provided with a question and the corresponding answer. Your role is to rate each answer on a scale of 1 to 5, where 1 signifies a poor response and 5 represents an excellent one. Please consider how well the answer addresses the question, its clarity, depth, and relevance. Additionally, provide constructive feedback in no more than 20 words to help the candidate improve. Your assessment format should follow this structure: Marks: _, Opinion on how it was: _, Suggestion for improvement: _, like you are an actual human interviwer.

    Human: {human_input}
    Chatbot: """

    llm = OpenAI(api_key="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")

    prompt = PromptTemplate(
        input_variables=["question", "answer"],
        template=template
    )

    llm_chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
    )

    return llm_chain

def initialize_text_to_speech():
    ai_evaluator = pyttsx3.init()
    voices = ai_evaluator.getProperty('voices')
    voices[1].gender = "female"
    voices[1].age = "young"
    ai_evaluator.setProperty('voice', voices[1].id)
    ai_evaluator.setProperty('rate', 120)
    return ai_evaluator

def ask_questions(questions, recognizer, ai_evaluator, llm_chain):
    evaluations = []

    for idx, question in enumerate(questions):

        ai_evaluator.say(f"This is your {ordinal(idx+1)} question")
        ai_evaluator.say(question)
        ai_evaluator.runAndWait()

        try:
            with speech_recognition.Microphone() as mic:
                recognizer.adjust_for_ambient_noise(mic, duration=0.8)
                audio = recognizer.listen(mic, timeout=20)
                text = recognizer.recognize_google(audio)
                text = text.lower()

                words = text.split()
            
                answer = ' '.join(words[:30])

                human_input = f"question: {question}\nanswer: {answer}"
                response = llm_chain.predict(human_input=human_input)
                evaluation = response

                evaluations.append(evaluation)
                
        except speech_recognition.UnknownValueError:
            ai_evaluator.say("Sorry, I did not get that")
            ai_evaluator.runAndWait()
            continue

    return evaluations

def provide_feedback(ai_evaluator, evaluations):
    ai_evaluator.say("Your interview is over")
    ai_evaluator.runAndWait()

    for idx, evaluation in enumerate(evaluations):
        ai_evaluator.say(f"For your {ordinal(idx+1)} question")
        ai_evaluator.say(evaluation)
        ai_evaluator.runAndWait()

    ai_evaluator.say("Thank you for participating in the interview, You did well. We will update you about the further process sooon. Take Care!")
    ai_evaluator.runAndWait()

def ordinal(n):
    suffix = ['th', 'st', 'nd', 'rd', 'th'][min(n % 10, 4)]
    if 11 <= (n % 100) <= 13:
        suffix = 'th'
    return f"{n}{suffix}"

def receive_questions():
    questions_json = sys.stdin.readline().strip()

    try:
        questions = json.loads(questions_json)
        return questions
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
        return None

def main():
    recognizer = speech_recognition.Recognizer()
    ai_evaluator = initialize_text_to_speech()
    # questions = receive_questions()
    questions = ["what is react?", "what is react used for?"]
    answers = ["A frontend web development framework used to develop frontends for the websites", "React is used to develop frontends for the websites"]

    evaluations = []
    for idx, question in enumerate(questions):
        llm_chain = initialize_llm_chain()
        human_input = f"question: {question}\nanswer: {answers[idx]}"
        response = llm_chain.predict(human_input=human_input)
        evaluations.append(response)
        # evaluations = ask_questions(questions, recognizer, ai_evaluator, llm_chain)
        # provide_feedback(ai_evaluator, evaluations)

    print("evaluations:", evaluations)

    return evaluations 

if __name__ == "__main__":
    main()
