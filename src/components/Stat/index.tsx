import { intComma } from '@/utils/utils';

interface IStatProperties {
  value: string | number;
  description: string;
  className?: string;
  citySize?: number;
  name?: string;
  onClick?: () => void;
}

const Stat = ({
  value,
  description,
  className = 'pb-2 w-full',
  citySize,
  name,
  onClick,
}: IStatProperties) => (
  <div className={`${className}`} onClick={onClick}>
    <span className={`text-5xl font-bold italic`}>{name}</span>
    <span className={`text-${citySize || 5}xl font-bold italic`}>
      {intComma(value.toString())}
    </span>
    <span className="text-lg font-semibold italic">{description}</span>
  </div>
);

export default Stat;
