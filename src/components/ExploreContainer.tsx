import "./ExploreContainer.css";
import React, { useEffect, useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRadio,
  IonRadioGroup,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonButton,
  IonProgressBar,
} from "@ionic/react";
import data from "../data.json";

interface ContainerProps {
  name: string;
}

class AnswerResponse {
  text!: string;
  correct!: boolean;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const shuffle = (a: number[]) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const randomArray = (length: number) => {
    const dataArray = Array.from(Array(length).keys());
    return shuffle(dataArray);
  };

  const [question, setQuestion] = useState(" ");
  const [answer1, setAnswer1] = useState<AnswerResponse>({
    text: " ",
    correct: false,
  });
  const [answer2, setAnswer2] = useState<AnswerResponse>({
    text: " ",
    correct: false,
  });
  const [answer3, setAnswer3] = useState<AnswerResponse>({
    text: " ",
    correct: false,
  });
  const [answer4, setAnswer4] = useState<AnswerResponse>({
    text: " ",
    correct: false,
  });
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [answerClass1, setAnswerClass1] = useState<string>("");
  const [answerClass2, setAnswerClass2] = useState<string>("");
  const [answerClass3, setAnswerClass3] = useState<string>("");
  const [answerClass4, setAnswerClass4] = useState<string>("");

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const [questionArray] = useState<number[]>(randomArray(data.length));
  const [progress, setProgress] = useState(0);
  const [firstStart, setFirstStart] = useState(true);

  const [image, setImage] = useState("");

  const answerClassName = (correct: boolean) => {
    return correct ? "correct-answer" : "false-answer";
  };

  const radioGroupChange = (e: CustomEvent) => {
    setSelectedAnswer(e.detail.value);
  };

  const nextQuestion = () => {
    if (!firstStart && selectedAnswer === "") return;
    let index = questionArray?.pop() as number;
    if (index === undefined) return;

    const answerArr = randomArray(4);
    setQuestion(data[index].question);
    setAnswer1(data[index].answers[answerArr.pop() as number]);
    setAnswer2(data[index].answers[answerArr.pop() as number]);
    setAnswer3(data[index].answers[answerArr.pop() as number]);
    setAnswer4(data[index].answers[answerArr.pop() as number]);
    setImage(data[index].image as string);
    const remainingQuestions = questionArray?.length || 0;
    const solvedQuestions = data.length - remainingQuestions;
    const percentage = (solvedQuestions * 0.1) / data.length;
    setProgress(percentage);
    setShowAnswer(true);
    setAnswerClass1("");
    setAnswerClass2("");
    setAnswerClass3("");
    setAnswerClass4("");
    setSelectedAnswer("");
  };

  const handleNext = () => {
    if (showAnswer) {
      switch (selectedAnswer) {
        case "1": {
          setAnswerClass1(answerClassName(answer1.correct));
          break;
        }
        case "2": {
          setAnswerClass2(answerClassName(answer2.correct));
          break;
        }
        case "3": {
          setAnswerClass3(answerClassName(answer3.correct));
          break;
        }
        case "4": {
          setAnswerClass4(answerClassName(answer4.correct));
          break;
        }
      }
      if (answer1.correct) setAnswerClass1(answerClassName(true));
      if (answer2.correct) setAnswerClass2(answerClassName(true));
      if (answer3.correct) setAnswerClass3(answerClassName(true));
      if (answer4.correct) setAnswerClass4(answerClassName(true));

      setShowAnswer(false);
      return;
    }
    nextQuestion();
  };

  useEffect(() => {
    if (firstStart) {
      nextQuestion();
      setFirstStart(false);
    }
  }, []);

  interface ItemProps {
    source: string;
  }

  const Image = React.memo(function Image({ source }: ItemProps) {
    return <IonImg src={source} />;
  });

  function Item({ source }: ItemProps) {
    if (!source) {
      return null;
    }
    return <Image source={source}></Image>;
  }

  return (
    <div className="container">
      <div className="textfield">
        <IonGrid>
          <IonRow>
            <IonProgressBar value={progress}></IonProgressBar>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    SBF Frage {data.length - (questionArray?.length || 0)}/
                    {data.length}
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  {question}
                  <br />
                  <IonRow>
                    <IonCol></IonCol>
                    <IonCol>
                      <IonRow>
                      <Item source={image}></Item>
                                              </IonRow>
                    </IonCol>
                    <IonCol></IonCol>
                  </IonRow>
                  <br />
                  <IonRadioGroup
                    value={selectedAnswer}
                    onIonChange={radioGroupChange}
                  >
                    <IonRadio labelPlacement="end" value="1">
                      <IonButton fill="outline" color="medium">
                        <span
                          className={`ion-text-wrap custom-button ${answerClass1}`}
                        >
                          {answer1?.text}
                        </span>
                      </IonButton>
                    </IonRadio>
                    <br />
                    <IonRadio labelPlacement="end" value="2">
                      <IonButton fill="outline" color="medium">
                        <span
                          className={`ion-text-wrap custom-button ${answerClass2}`}
                        >
                          {answer2?.text}
                        </span>
                      </IonButton>
                    </IonRadio>
                    <br />
                    <IonRadio labelPlacement="end" value="3">
                      <IonButton fill="outline" color="medium">
                        <span
                          className={`ion-text-wrap custom-button ${answerClass3}`}
                        >
                          {answer3?.text}
                        </span>
                      </IonButton>
                    </IonRadio>
                    <br />
                    <IonRadio labelPlacement="end" value="4">
                      <IonButton fill="outline" color="medium">
                        <span
                          className={`ion-text-wrap custom-button ${answerClass4}`}
                        >
                          {answer4?.text}
                        </span>
                      </IonButton>
                    </IonRadio>
                  </IonRadioGroup>
                  <IonRow>
                    <IonCol></IonCol>
                    <IonCol></IonCol>
                    <IonCol></IonCol>
                    <IonCol></IonCol>
                    <IonCol>
                      <IonButton
                        disabled={selectedAnswer === ""}
                        onClick={handleNext}
                      >
                        Weiter
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </div>
  );
};

export default ExploreContainer;
