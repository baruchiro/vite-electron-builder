import { useMemo } from 'react';
import Badge from 'react-bootstrap/Badge';
import piggyBank from '../../assets/piggy-bank.svg';
import { type Account as AccountType } from '../../types';
import styles from './Account.module.css';
import StatusIndicator from './StatusIndicator';

export type ActionButton = {
  icon: string;
  tooltipText: string;
  clickHandler?: () => void;
};

type AccountProps = {
  account: AccountType;
  actionButtons?: ActionButton[];
};

export default function Account({ account, actionButtons }: AccountProps) {
  const containerStyles = useMemo(() => {
    const s = [styles.container];
    if (!account.active) s.push(styles.notActive);
    if (!actionButtons) s.push(styles.pointer);
    return s;
  }, [account.active, actionButtons]);

  const badgeNumberLog = useMemo(
    () =>
      account.logs.find(log => log.originalEvent && log.originalEvent.exportedTransactionsNum > 0),
    [account.logs],
  );

  return (
    <div className={containerStyles.join(' ')}>
      <img src={account.logo || piggyBank} alt={account.displayName} height={29} width={29} />
      <div className={styles.nameWrapper}>
        <div className={styles.name}>{account.displayName}</div>
      </div>
      {actionButtons &&
        actionButtons.map(({ icon, clickHandler, tooltipText }) => (
          <img
            className={styles.logsButton}
            src={icon}
            alt="action"
            onClick={clickHandler}
            key={icon}
            title={tooltipText}
          />
        ))}
      <StatusIndicator status={account.status} />
      {badgeNumberLog && (
        <Badge className={styles.newTxnsIndicator} bg={'success'}>
          {badgeNumberLog.originalEvent.exportedTransactionsNum}
        </Badge>
      )}
    </div>
  );
}
