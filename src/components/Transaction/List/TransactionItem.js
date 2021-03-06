import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import { Icon, Button, Label } from 'semantic-ui-react'
import Amount from '../../Amount'
import Transaction, {
  EXPENSE,
  TRANSFER,
  INCOME
} from '../../../entities/Transaction'
import { toLocalTimestamp } from '../../../util/timezone'

class TransactionItem extends React.Component {
  handleEditClick = () => {
    this.props.openTransactionInModal(
      Transaction.toForm(this.props.transaction)
    )
  }

  render() {
    const { transaction } = this.props
    return (
      <div className="transaction-item">
        <div className="transaction-item__date">
          {format(toLocalTimestamp(transaction.date), 'DD MMM')}
        </div>
        <div className="transaction-item__info">
          {transaction.accountName}
          {this.renderArrow()}
          {transaction.kind === TRANSFER && transaction.linkedAccountName}
          {transaction.tags.map(tag => <Label key={tag} content={tag} />)}
          <span className="transaction-item__info__note">
            {transaction.note}
          </span>
        </div>
        <div className="transaction-item__amount">
          <Amount
            value={transaction.amount}
            code={transaction.currency}
            showColor={transaction.kind !== TRANSFER}
          />
          {transaction.kind === TRANSFER && this.renderLinkedAmount()}
        </div>
        <div className="transaction-item__edit">
          <Button circular basic icon="pencil" onClick={this.handleEditClick} />
        </div>
      </div>
    )
  }

  renderArrow() {
    const { kind, tags, note } = this.props.transaction
    if (kind !== TRANSFER && !tags.length && !note.length) return

    return (
      <Icon
        color="grey"
        name={kind === INCOME ? 'long arrow left' : 'long arrow right'}
      />
    )
  }

  renderLinkedAmount() {
    const { linkedAmount, linkedCurrency, currency } = this.props.transaction
    if (!linkedCurrency || linkedCurrency === currency) return

    return (
      <span>
        <Icon color="grey" name="long arrow right" />
        <Amount value={linkedAmount} code={linkedCurrency} showColor={false} />
      </span>
    )
  }
}

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    kind: PropTypes.oneOf([EXPENSE, TRANSFER, INCOME]),
    id: PropTypes.string,
    accountId: PropTypes.string,
    accountName: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string,
    linkedAccountId: PropTypes.string,
    linkedAccountName: PropTypes.string,
    linkedAmount: PropTypes.number,
    linkedCurrency: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    note: PropTypes.string,
    date: PropTypes.number
  }),
  openTransactionInModal: PropTypes.func
}

export default TransactionItem
