import {
  IonContent,
  IonPage,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <ExploreContainer name="Questions" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
