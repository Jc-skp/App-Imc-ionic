import React, { useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonText
} from '@ionic/react';
import { calculator, scale } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Interface para os dados do usuário
interface UserData {
    height: string;
    weight: string;
    age: string;
    gender: string;
}

// Interface para o resultado do cálculo
interface CalculationResult {
    imc: string;
    classification: string;
    weightToAdjust: string;
    adjustmentType: string;
    minIdealWeight: string;
    maxIdealWeight: string;
    height: string;
    weight: string;
    age: string;
    gender: string;
}

const Home: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState<UserData>({
        height: '',
        weight: '',
        age: '',
        gender: 'masculino'
    });

    // Atualizar campos do formulário
    const handleInputChange = (field: keyof UserData) => (event: CustomEvent) => {
        const value = event.detail.value || '';
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateIMC = () => {
        const { height, weight } = formData;

        if (!height || !weight) {
            alert('Por favor, preencha altura e peso!');
            return;
        }

        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);

        const imc = weightInKg / (heightInMeters * heightInMeters);

        // Classificação OMS
        let classification = '';
        if (imc < 18.5) classification = 'Abaixo do peso';
        else if (imc < 25) classification = 'Peso normal';
        else if (imc < 30) classification = 'Sobrepeso';
        else if (imc < 35) classification = 'Obesidade Grau I';
        else if (imc < 40) classification = 'Obesidade Grau II';
        else classification = 'Obesidade Grau III';

        // Calcular peso ideal (IMC entre 18.5 e 24.9)
        const minIdealWeight = 18.5 * (heightInMeters * heightInMeters);
        const maxIdealWeight = 24.9 * (heightInMeters * heightInMeters);

        let weightToAdjust = 0;
        let adjustmentType = '';

        if (imc < 18.5) {
            weightToAdjust = minIdealWeight - weightInKg;
            adjustmentType = 'ganhar';
        } else if (imc > 24.9) {
            weightToAdjust = weightInKg - maxIdealWeight;
            adjustmentType = 'perder';
        }

        // Preparar dados para envio
        const resultData: CalculationResult = {
            imc: imc.toFixed(2),
            classification,
            weightToAdjust: weightToAdjust > 0 ? weightToAdjust.toFixed(1) : '0',
            adjustmentType,
            minIdealWeight: minIdealWeight.toFixed(1),
            maxIdealWeight: maxIdealWeight.toFixed(1),
            height: formData.height,
            weight: formData.weight,
            age: formData.age,
            gender: formData.gender
        };

        // Navegar para tela de resultados
        history.push('/result', resultData);
    };

    const isFormValid = formData.height && formData.weight;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Calculadora de IMC</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <IonIcon icon={calculator} size="large" color="primary" />
                            <h2>Calculadora de IMC</h2>
                            <IonText color="medium">
                                <p>Calcule seu Índice de Massa Corporal</p>
                            </IonText>
                        </div>

                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="stacked">Altura (cm)*</IonLabel>
                                        <IonInput
                                            type="number"
                                            value={formData.height}
                                            onIonInput={handleInputChange('height')}
                                            placeholder="Ex: 175"
                                            min="0"
                                        ></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>

                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel position="stacked">Peso (kg)*</IonLabel>
                                        <IonInput
                                            type="number"
                                            value={formData.weight}
                                            onIonInput={handleInputChange('weight')}
                                            placeholder="Ex: 70"
                                            min="0"
                                        ></IonInput>
                                    </IonItem>
                                </IonCol>
                            </IonRow>

                            <IonRow>
                                <IonCol size="6">
                                    <IonItem>
                                        <IonLabel position="stacked">Idade (opcional)</IonLabel>
                                        <IonInput
                                            type="number"
                                            value={formData.age}
                                            onIonInput={handleInputChange('age')}
                                            placeholder="Ex: 30"
                                            min="0"
                                            max="120"
                                        ></IonInput>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="6">
                                    <IonItem>
                                        <IonLabel position="stacked">Sexo</IonLabel>
                                        <IonSelect
                                            value={formData.gender}
                                            onIonChange={handleInputChange('gender')}
                                        >
                                            <IonSelectOption value="masculino">Masculino</IonSelectOption>
                                            <IonSelectOption value="feminino">Feminino</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                            </IonRow>

                            <IonRow>
                                <IonCol>
                                    <IonButton
                                        expand="block"
                                        onClick={calculateIMC}
                                        disabled={!isFormValid}
                                        style={{ marginTop: '20px' }}
                                        color="primary"
                                    >
                                        <IonIcon icon={scale} slot="start" />
                                        Calcular IMC
                                    </IonButton>
                                    {!isFormValid && (
                                        <IonText color="medium">
                                            <p style={{ textAlign: 'center', fontSize: '0.9em', marginTop: '10px' }}>
                                                * Preencha altura e peso para calcular
                                            </p>
                                        </IonText>
                                    )}
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                {/* Card informativo sobre IMC */}
                <IonCard color="light">
                    <IonCardContent>
                        <h3>📊 O que é IMC?</h3>
                        <p>
                            O Índice de Massa Corporal (IMC) é uma medida internacional
                            usada para calcular se uma pessoa está no peso ideal,
                            baseando-se na relação entre peso e altura.
                        </p>
                    </IonCardContent>
                </IonCard>

                {/* Card com informações sobre classificação */}
                <IonCard color="secondary">
                    <IonCardContent>
                        <h3>🏥 Classificação OMS</h3>
                        <IonGrid>
                            <IonRow style={{ fontWeight: 'bold', borderBottom: '1px solid #ccc' }}>
                                <IonCol>IMC</IonCol>
                                <IonCol>Classificação</IonCol>
                            </IonRow>
                            <IonRow style={{ borderBottom: '1px solid #eee' }}>
                                <IonCol>&lt; 18,5</IonCol>
                                <IonCol>Abaixo do peso</IonCol>
                            </IonRow>
                            <IonRow style={{ borderBottom: '1px solid #eee' }}>
                                <IonCol>18,5 - 24,9</IonCol>
                                <IonCol>Peso normal</IonCol>
                            </IonRow>
                            <IonRow style={{ borderBottom: '1px solid #eee' }}>
                                <IonCol>25 - 29,9</IonCol>
                                <IonCol>Sobrepeso</IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>≥ 30</IonCol>
                                <IonCol>Obesidade</IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Home;