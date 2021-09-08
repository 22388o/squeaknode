# MIT License
#
# Copyright (c) 2020 Jonathan Zernik
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
"""Change created time of sent payment to integer of milliseconds

Revision ID: cc2c5805b8e7
Revises: af0082f29c93
Create Date: 2021-09-07 16:09:57.879198

"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy import text

import squeaknode.db.models


# revision identifiers, used by Alembic.
revision = 'cc2c5805b8e7'
down_revision = 'af0082f29c93'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sent_payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column(
            'created_time_ms', squeaknode.db.models.SLBigInteger(), server_default=text('0'), nullable=False))
        batch_op.drop_column('created')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('sent_payment', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created', sa.DATETIME(
        ), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False))
        batch_op.drop_column('created_time_ms')

    # ### end Alembic commands ###