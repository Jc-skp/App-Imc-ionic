import React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
    IonChip,
    IonLabel
} from '@ionic/react';
import {
    arrowBack,
    body,
    trendingUp,
    trendingDown,
    checkmarkCircle,
    warning,
    alertCircle,
    calculator
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';

// Interface para os dados do resultado
interface ResultData {
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

const Result: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    // Obter dados da navegação com tipo seguro
    const resultData = location.state as ResultData;

    // Função para voltar à tela inicial - CORRIGIDA
    const handleCalculateAgain = () => {
        // Usando replace para evitar acúmulo no histórico
        history.replace('/');
    };

    // Função para voltar à tela anterior
    const handleGoBack = () => {
        if (history.length > 1) {
            history.goBack();
        } else {
            history.replace('/');
        }
    };

    // Se não houver dados, mostrar tela de erro
    if (!resultData) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonButton slot="start" fill="clear" onClick={handleGoBack}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                        <IonTitle>Erro</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <IonIcon icon={warning} size="large" color="danger" />
                        <h2>Dados não encontrados</h2>
                        <p>Não foi possível recuperar os dados do cálculo.</p>
                        <IonButton onClick={handleCalculateAgain} color="primary">
                            <IonIcon icon={calculator} slot="start" />
                            Fazer Novo Cálculo
                        </IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    // Funções auxiliares para estilização
    const getClassificationColor = (classification: string): 'success' | 'warning' | 'danger' | 'medium' => {
        switch (classification) {
            case 'Peso normal': return 'success';
            case 'Abaixo do peso': return 'warning';
            case 'Sobrepeso': return 'warning';
            case 'Obesidade Grau I': return 'danger';
            case 'Obesidade Grau II': return 'danger';
            case 'Obesidade Grau III': return 'danger';
            default: return 'medium';
        }
    };

    const getClassificationIcon = (classification: string) => {
        switch (classification) {
            case 'Peso normal': return checkmarkCircle;
            case 'Abaixo do peso': return warning;
            case 'Sobrepeso': return warning;
            default: return alertCircle;
        }
    };

    const getCardColor = (classification: string): 'success' | 'warning' | 'danger' | undefined => {
        switch (classification) {
            case 'Peso normal': return 'success';
            case 'Abaixo do peso': return 'warning';
            case 'Sobrepeso': return 'warning';
            default: return 'danger';
        }
    };

    const weightToAdjustNum = parseFloat(resultData.weightToAdjust);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButton slot="start" fill="clear" onClick={handleGoBack}>
                        <IonIcon icon={arrowBack} />
                        Voltar
                    </IonButton>
                    <IonTitle>Resultado do IMC</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                {/* Card do Resultado Principal */}
                <IonCard color={getCardColor(resultData.classification)}>
                    <IonCardContent>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <IonIcon
                                icon={body}
                                size="large"
                            />
                            <h2>Seu Resultado</h2>
                        </div>

                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <div style={{ textAlign: 'center' }}>
                                        <IonText>
                                            <h1 style={{ fontSize: '3em', margin: '10px 0', fontWeight: 'bold' }}>
                                                {resultData.imc}
                                            </h1>
                                        </IonText>
                                        <IonChip color={getClassificationColor(resultData.classification)}>
                                            <IonIcon icon={getClassificationIcon(resultData.classification)} />
                                            <IonLabel>{resultData.classification}</IonLabel>
                                        </IonChip>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                {/* Card de Recomendações - Só mostra se precisa ajustar peso */}
                {weightToAdjustNum > 0 && (
                    <IonCard color={resultData.adjustmentType === 'ganhar' ? 'warning' : 'danger'}>
                        <IonCardContent>
                            <IonGrid>
                                <IonRow className="ion-align-items-center">
                                    <IonCol size="auto">
                                        <IonIcon
                                            icon={resultData.adjustmentType === 'ganhar' ? trendingUp : trendingDown}
                                            size="large"
                                        />
                                    </IonCol>
                                    <IonCol>
                                        <h3>
                                            {resultData.adjustmentType === 'ganhar' ? '📈 Ganhar Peso' : '📉 Perder Peso'}
                                        </h3>
                                        <p style={{ margin: '5px 0', fontSize: '1.1em', fontWeight: 'bold' }}>
                                            Você precisa {resultData.adjustmentType} <strong>{resultData.weightToAdjust} kg</strong>
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.9em' }}>
                                            Para alcançar o peso ideal: {resultData.minIdealWeight} - {resultData.maxIdealWeight} kg
                                        </p>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCardContent>
                    </IonCard>
                )}

                {/* Card de Parabéns - Se estiver no peso ideal */}
                {weightToAdjustNum === 0 && (
                    <IonCard color="success">
                        <IonCardContent>
                            <IonGrid>
                                <IonRow className="ion-align-items-center">
                                    <IonCol size="auto">
                                        <IonIcon icon={checkmarkCircle} size="large" />
                                    </IonCol>
                                    <IonCol>
                                        <h3>🎉 Parabéns!</h3>
                                        <p>Você está na faixa de peso ideal according to OMS.</p>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCardContent>
                    </IonCard>
                )}

                {/* Card de Informações Detalhadas */}
                <IonCard color="light">
                    <IonCardContent>
                        <h3>📋 Seus Dados</h3>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="6">
                                    <p><strong>Altura:</strong></p>
                                    <p><strong>Peso:</strong></p>
                                    {resultData.age && <p><strong>Idade:</strong></p>}
                                    <p><strong>Sexo:</strong></p>
                                </IonCol>
                                <IonCol size="6">
                                    <p>{resultData.height} cm</p>
                                    <p>{resultData.weight} kg</p>
                                    {resultData.age && <p>{resultData.age} anos</p>}
                                    <p>{resultData.gender === 'masculino' ? 'Masculino' : 'Feminino'}</p>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                {/* Tabela de Classificação OMS */}
                <IonCard>
                    <IonCardContent>
                        <h3>🏥 Classificação OMS</h3>
                        <IonGrid>
                            <IonRow className="ion-text-center" style={{ fontWeight: 'bold', borderBottom: '2px solid #3880ff', padding: '10px 0' }}>
                                <IonCol>IMC</IonCol>
                                <IonCol>Classificação</IonCol>
                            </IonRow>
                            <IonRow style={{
                                borderBottom: '1px solid #eee',
                                padding: '8px 0',
                                backgroundColor: resultData.classification === 'Abaixo do peso' ? '#fff3cd' : 'transparent'
                            }}>
                                <IonCol>&lt; 18,5</IonCol>
                                <IonCol>Abaixo do peso</IonCol>
                            </IonRow>
                            <IonRow style={{
                                borderBottom: '1px solid #eee',
                                padding: '8px 0',
                                backgroundColor: resultData.classification === 'Peso normal' ? '#d4edda' : 'transparent'
                            }}>
                                <IonCol>18,5 - 24,9</IonCol>
                                <IonCol>Peso normal</IonCol>
                            </IonRow>
                            <IonRow style={{
                                borderBottom: '1px solid #eee',
                                padding: '8px 0',
                                backgroundColor: resultData.classification === 'Sobrepeso' ? '#fff3cd' : 'transparent'
                            }}>
                                <IonCol>25 - 29,9</IonCol>
                                <IonCol>Sobrepeso</IonCol>
                            </IonRow>
                            <IonRow style={{
                                borderBottom: '1px solid #eee',
                                padding: '8px 0',
                                backgroundColor: resultData.classification.includes('Obesidade') ? '#f8d7da' : 'transparent'
                            }}>
                                <IonCol>≥ 30</IonCol>
                                <IonCol>Obesidade</IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                {/* Botão para Calcular Novamente - CORRIGIDO */}
                <IonButton
                    expand="block"
                    onClick={handleCalculateAgain}
                    color="primary"
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                    size="large"
                >
                    <IonIcon icon={calculator} slot="start" />
                    Calcular Novamente
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Result;