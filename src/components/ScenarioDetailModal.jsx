import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    transform: translateY(24px) scale(0.98);
    opacity: 0;
  }
  to { 
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 13, 13, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  animation: ${fadeIn} 200ms ease-out;
`;

const ModalContainer = styled.div`
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--color-border);
  max-width: 720px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 300ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  padding: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
`;

const ScenarioTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-muted);
  transition: all var(--transition-fast);
  flex-shrink: 0;
  
  &:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-color: var(--color-accent);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

const MetaBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 4px 10px;
  background: ${props => props.variant === 'accent' 
    ? 'var(--color-accent-soft)' 
    : 'var(--color-bg-tertiary)'};
  color: ${props => props.variant === 'accent' 
    ? 'var(--color-accent)' 
    : 'var(--color-text-secondary)'};
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
`;

const ModalBody = styled.div`
  padding: var(--space-xl);
  overflow-y: auto;
  flex: 1;
`;

const SectionGrid = styled.div`
  display: grid;
  gap: var(--space-xl);
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SectionTitle = styled.h3`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
`;

const PersonaCard = styled.div`
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-lg);
`;

const PersonaAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const PersonaInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PersonaName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const PersonaDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
`;

const PersonaTraits = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
`;

const Trait = styled.span`
  padding: 2px 8px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  color: var(--color-text-secondary);
`;

const BehaviorCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
`;

const BehaviorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
`;

const BehaviorState = styled.span`
  padding: 2px 8px;
  background: ${props => {
    switch(props.state) {
      case 'calm': return '#DCFCE7';
      case 'frustrated': return '#FEE2E2';
      case 'confused': return '#FEF3C7';
      default: return 'var(--color-bg-tertiary)';
    }
  }};
  color: ${props => {
    switch(props.state) {
      case 'calm': return '#166534';
      case 'frustrated': return '#991B1B';
      case 'confused': return '#92400E';
      default: return 'var(--color-text-secondary)';
    }
  }};
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const BehaviorDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
`;

const BehaviorHints = styled.p`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: var(--space-sm) 0 0;
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--color-border);
`;

const FlowTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
`;

const FlowStep = styled.div`
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 11px;
    top: 28px;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
  }
`;

const FlowNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  z-index: 1;
`;

const FlowContent = styled.div`
  flex: 1;
  padding-top: 2px;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  line-height: 1.5;
`;

const CriteriaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CriteriaCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  
  &.should {
    border-left: 3px solid var(--color-success);
  }
  
  &.should-not {
    border-left: 3px solid var(--color-error);
  }
`;

const CriteriaTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.type === 'should' 
    ? 'var(--color-success)' 
    : 'var(--color-error)'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`;

const CriteriaList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const CriteriaItem = styled.li`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  padding-left: var(--space-md);
  position: relative;
  
  &::before {
    content: '${props => props.type === 'should' ? '✓' : '✗'}';
    position: absolute;
    left: 0;
    color: ${props => props.type === 'should' 
      ? 'var(--color-success)' 
      : 'var(--color-error)'};
    font-size: 0.75rem;
  }
`;

const IndustryCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
`;

const IndustryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
`;

const IndustryIcon = styled.span`
  font-size: 1.25rem;
`;

const IndustryName = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const IndustryVertical = styled.p`
  font-size: 0.8125rem;
  color: var(--color-accent);
  font-weight: 500;
  margin: 0 0 var(--space-xs);
`;

const IndustryDescription = styled.p`
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
`;

const TurnExpectationsCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const TurnExpectationRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-of-type(odd) {
    background: var(--color-bg-tertiary);
  }
`;

const TurnNumber = styled.span`
  min-width: 48px;
  padding: 2px 8px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
  text-align: center;
`;

const TurnExpectation = styled.span`
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  line-height: 1.5;
`;

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const getGenderEmoji = (gender) => {
  switch(gender?.toLowerCase()) {
    case 'male': return '👨';
    case 'female': return '👩';
    default: return '🧑';
  }
};

const getIndustryIcon = (industry) => {
  const lower = industry?.toLowerCase() || '';
  if (lower.includes('financial') || lower.includes('banking')) return '💰';
  if (lower.includes('health') || lower.includes('medical')) return '🏥';
  if (lower.includes('tech') || lower.includes('software')) return '💻';
  if (lower.includes('retail') || lower.includes('commerce')) return '🛒';
  if (lower.includes('travel') || lower.includes('hospitality')) return '✈️';
  if (lower.includes('education')) return '📚';
  return '🏢';
};

const ScenarioDetailModal = ({ isOpen, onClose, scenario }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !scenario) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Extract data from scenario
  const scenarioName = scenario.scenario_name || scenario.name || 'Unnamed Scenario';
  const context = scenario.simulation_context || {};
  const callerProfile = context.caller_profile || {};
  const behavior = context.behavior || {};
  const conversationFlow = context.conversation_flow || [];
  const industryContext = context.industry_context || {};
  const evaluationCriteria = scenario.evaluation_criteria || {};
  const agentShould = evaluationCriteria.agent_should || [];
  const agentShouldNot = evaluationCriteria.agent_should_not || [];
  const turnExpectations = evaluationCriteria.turn_expectations || [];
  const categories = scenario.metadata?.categories || {};

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTop>
            <ScenarioTitle>{scenarioName}</ScenarioTitle>
            <CloseButton onClick={onClose} aria-label="Close modal">
              <CloseIcon />
            </CloseButton>
          </HeaderTop>
          <HeaderMeta>
            {context.call_direction && (
              <MetaBadge variant="accent">
                {context.call_direction === 'inbound' ? '📥' : '📤'} {context.call_direction}
              </MetaBadge>
            )}
            {categories.scenario_type && (
              <MetaBadge>{categories.scenario_type}</MetaBadge>
            )}
            {categories.journey_stage && (
              <MetaBadge>{categories.journey_stage.replace(/_/g, ' ')}</MetaBadge>
            )}
            {Array.isArray(categories.topics) && categories.topics.map((topic, i) => (
              <MetaBadge key={i}>{topic.replace(/_/g, ' ')}</MetaBadge>
            ))}
          </HeaderMeta>
        </ModalHeader>

        <ModalBody>
          <SectionGrid>
            {/* Caller Profile */}
            {callerProfile.persona && (
              <Section>
                <SectionTitle>Caller Profile</SectionTitle>
                <PersonaCard>
                  <PersonaAvatar>
                    {getGenderEmoji(callerProfile.gender)}
                  </PersonaAvatar>
                  <PersonaInfo>
                    <PersonaName>
                      {callerProfile.name || 'Anonymous Caller'}
                      {callerProfile.age_range && (
                        <Trait style={{ marginLeft: 'var(--space-xs)' }}>
                          {callerProfile.age_range.replace(/_/g, ' ')}
                        </Trait>
                      )}
                    </PersonaName>
                    <PersonaDescription>{callerProfile.persona}</PersonaDescription>
                    {callerProfile.voice_characteristics?.personality_traits && (
                      <PersonaTraits>
                        {callerProfile.voice_characteristics.personality_traits.map((trait, i) => (
                          <Trait key={i}>{trait}</Trait>
                        ))}
                      </PersonaTraits>
                    )}
                  </PersonaInfo>
                </PersonaCard>
              </Section>
            )}

            {/* Behavior */}
            {behavior.description && (
              <Section>
                <SectionTitle>Caller Behavior</SectionTitle>
                <BehaviorCard>
                  <BehaviorHeader>
                    {behavior.state && (
                      <BehaviorState state={behavior.state}>
                        {behavior.state}
                      </BehaviorState>
                    )}
                  </BehaviorHeader>
                  <BehaviorDescription>{behavior.description}</BehaviorDescription>
                  {behavior.behavioral_hints && (
                    <BehaviorHints>{behavior.behavioral_hints}</BehaviorHints>
                  )}
                </BehaviorCard>
              </Section>
            )}

            {/* Industry Context */}
            {industryContext.industry && (
              <Section>
                <SectionTitle>Industry Context</SectionTitle>
                <IndustryCard>
                  <IndustryHeader>
                    <IndustryIcon>{getIndustryIcon(industryContext.industry)}</IndustryIcon>
                    <IndustryName>{industryContext.industry}</IndustryName>
                  </IndustryHeader>
                  {industryContext.vertical && (
                    <IndustryVertical>{industryContext.vertical}</IndustryVertical>
                  )}
                  {industryContext.vertical_description && (
                    <IndustryDescription>
                      {industryContext.vertical_description}
                    </IndustryDescription>
                  )}
                </IndustryCard>
              </Section>
            )}

            {/* Conversation Flow */}
            {conversationFlow.length > 0 && (
              <Section>
                <SectionTitle>Expected Conversation Flow</SectionTitle>
                <FlowTimeline>
                  {conversationFlow.map((step, index) => (
                    <FlowStep key={index}>
                      <FlowNumber>{index + 1}</FlowNumber>
                      <FlowContent>{step.caller_goal}</FlowContent>
                    </FlowStep>
                  ))}
                </FlowTimeline>
              </Section>
            )}

            {/* Evaluation Criteria */}
            {(agentShould.length > 0 || agentShouldNot.length > 0) && (
              <Section>
                <SectionTitle>Evaluation Criteria</SectionTitle>
                <CriteriaGrid>
                  {agentShould.length > 0 && (
                    <CriteriaCard className="should">
                      <CriteriaTitle type="should">
                        ✓ Agent Should
                      </CriteriaTitle>
                      <CriteriaList>
                        {agentShould.slice(0, 6).map((item, i) => (
                          <CriteriaItem key={i} type="should">{item}</CriteriaItem>
                        ))}
                        {agentShould.length > 6 && (
                          <CriteriaItem type="should" style={{ fontStyle: 'italic' }}>
                            +{agentShould.length - 6} more...
                          </CriteriaItem>
                        )}
                      </CriteriaList>
                    </CriteriaCard>
                  )}
                  {agentShouldNot.length > 0 && (
                    <CriteriaCard className="should-not">
                      <CriteriaTitle type="should-not">
                        ✗ Agent Should Not
                      </CriteriaTitle>
                      <CriteriaList>
                        {agentShouldNot.slice(0, 6).map((item, i) => (
                          <CriteriaItem key={i} type="should-not">{item}</CriteriaItem>
                        ))}
                        {agentShouldNot.length > 6 && (
                          <CriteriaItem type="should-not" style={{ fontStyle: 'italic' }}>
                            +{agentShouldNot.length - 6} more...
                          </CriteriaItem>
                        )}
                      </CriteriaList>
                    </CriteriaCard>
                  )}
                </CriteriaGrid>
              </Section>
            )}

            {/* Turn Expectations */}
            {turnExpectations.length > 0 && (
              <Section>
                <SectionTitle>Turn-by-Turn Expectations</SectionTitle>
                <TurnExpectationsCard>
                  {turnExpectations.map((turn, index) => (
                    <TurnExpectationRow key={index}>
                      <TurnNumber>Turn {turn.turn_number}</TurnNumber>
                      <TurnExpectation>{turn.agent_expectation}</TurnExpectation>
                    </TurnExpectationRow>
                  ))}
                </TurnExpectationsCard>
              </Section>
            )}
          </SectionGrid>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default ScenarioDetailModal;

