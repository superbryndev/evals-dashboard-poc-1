import React from 'react';
import styled from '@emotion/styled';

const EvaluationContainer = styled.div`
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const EvaluationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: ${props => props.passed ? 
    'rgba(34, 197, 94, 0.1)' : 
    'rgba(239, 68, 68, 0.1)'
  };
  border-bottom: 1px solid var(--color-border);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const PassFailBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  
  ${props => props.passed ? `
    background: var(--color-success);
    color: white;
  ` : `
    background: var(--color-error);
    color: white;
  `}
`;

const ScoreText = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-weight: 500;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const CachedBadge = styled.span`
  font-size: 0.6875rem;
  padding: 2px 6px;
  background: var(--color-bg-tertiary);
  color: var(--color-muted);
  border-radius: var(--radius-full);
`;

const RefreshButton = styled.button`
  padding: var(--space-xs) var(--space-sm);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  font-size: 0.75rem;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EvaluationBody = styled.div`
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const Summary = styled.p`
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  line-height: 1.6;
  padding: var(--space-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
`;

const GoalsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const SectionTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GoalItem = styled.div`
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  border-left: 3px solid ${props => props.passed ? 
    'var(--color-success)' : 
    'var(--color-error)'
  };
`;

const GoalIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;

const GoalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const GoalText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const GoalEvidence = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
  font-style: italic;
`;

const GoalReasoning = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
`;

const CallPathSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const PathStep = styled.div`
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm);
  
  .step-number {
    width: 24px;
    height: 24px;
    background: var(--color-accent);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  .step-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .description {
      font-size: 0.875rem;
      color: var(--color-text-primary);
    }
    
    .actions {
      font-size: 0.75rem;
      color: var(--color-muted);
    }
  }
`;

const CallEvaluationCard = ({ evaluation, onReEvaluate, isLoading }) => {
  if (!evaluation) return null;

  const {
    overall_passed,
    goals_evaluated = 0,
    goals_passed = 0,
    goal_evaluations = [],
    call_path = [],
    summary,
    cached,
  } = evaluation;

  return (
    <EvaluationContainer>
      <EvaluationHeader passed={overall_passed}>
        <HeaderLeft>
          <PassFailBadge passed={overall_passed}>
            {overall_passed ? '✓ PASSED' : '✗ FAILED'}
          </PassFailBadge>
          <ScoreText>
            {goals_passed}/{goals_evaluated} goals achieved
          </ScoreText>
        </HeaderLeft>
        <HeaderRight>
          {cached && <CachedBadge>cached</CachedBadge>}
          <RefreshButton 
            onClick={onReEvaluate}
            disabled={isLoading}
          >
            {isLoading ? '...' : '🔄 Re-evaluate'}
          </RefreshButton>
        </HeaderRight>
      </EvaluationHeader>
      
      <EvaluationBody>
        {summary && (
          <Summary>{summary}</Summary>
        )}
        
        {goal_evaluations.length > 0 && (
          <GoalsSection>
            <SectionTitle>Goal Evaluations</SectionTitle>
            {goal_evaluations.map((goal, index) => (
              <GoalItem key={index} passed={goal.passed}>
                <GoalIcon>{goal.passed ? '✅' : '❌'}</GoalIcon>
                <GoalContent>
                  <GoalText>{goal.goal}</GoalText>
                  {goal.evidence && (
                    <GoalEvidence>"{goal.evidence}"</GoalEvidence>
                  )}
                  {goal.reasoning && (
                    <GoalReasoning>{goal.reasoning}</GoalReasoning>
                  )}
                </GoalContent>
              </GoalItem>
            ))}
          </GoalsSection>
        )}
        
        {call_path.length > 0 && (
          <CallPathSection>
            <SectionTitle>Call Path</SectionTitle>
            {call_path.map((step) => (
              <PathStep key={step.step_number}>
                <span className="step-number">{step.step_number}</span>
                <div className="step-content">
                  <span className="description">{step.description}</span>
                  {(step.agent_action || step.user_response) && (
                    <span className="actions">
                      {step.agent_action && `Agent: ${step.agent_action}`}
                      {step.agent_action && step.user_response && ' → '}
                      {step.user_response && `User: ${step.user_response}`}
                    </span>
                  )}
                </div>
              </PathStep>
            ))}
          </CallPathSection>
        )}
      </EvaluationBody>
    </EvaluationContainer>
  );
};

export default CallEvaluationCard;

